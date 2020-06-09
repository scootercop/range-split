import React from 'react';
import { ErrorList, StringConstants, RegexPattern } from './const';
import { RangePair } from './RangePairClass'
import { RangeInput } from './RangeInputClass'
import { DataCount } from './DataCountClass'
import { DataRange } from './DataRangeClass'
import { RangeInputUpdateType } from './Enums';

interface IRangeSplitContainerProps {
    init?: string;
    rows: number;
    children: any;
    customErrors: boolean;
}

interface IRangeSplitContainerState {
    originalInput: string;
    inputData: DataRange[]; // actual data
    dataState: RangeInput[][]; // view
    countStore: DataCount;
    errors: Error[];
}

export interface IOutputPropsInterface {
    dataUpdateCallback: (rowIndex: number, rangeIndex: number, input: string, type: RangeInputUpdateType) => void;
    dataChangeHandler: (rowIndex: number, rangeIndex: number, input: string, type: RangeInputUpdateType) => void;
    addRow: (rowIndex: number) => void;
    inputParser: (range: string) => DataRange[];
    dataState: RangeInput[][];
    errors: Error[];
    originalInput: string;
    countStore: DataCount;
    customErrors: boolean;
}

export class RangeSplitContainerComponent extends React.Component<IRangeSplitContainerProps, IRangeSplitContainerState> {
    constructor(props: IRangeSplitContainerProps) {
        super(props);
        let initDataState = this.GetEmptyDataState();
        this.state = { inputData: [], errors: [], dataState: initDataState, countStore: new DataCount(0), originalInput: StringConstants.EmptyString };
        this.inputParser = this.inputParser.bind(this);
        this.dataUpdateCallback = this.dataUpdateCallback.bind(this);
        this.dataChangeHandler = this.dataChangeHandler.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    private GetEmptyDataState() {
        let initDataState: RangeInput[][] = [];
        for (let i = 0; i < this.props.rows; i++) {
            initDataState.push(new Array<RangeInput>(new RangeInput(undefined, undefined)));
        }
        return initDataState;
    }

    private getCountFromData(data: DataRange[]) {
        let sum = 0;
        for (let section of data) {
            sum += section.data.length;
        }
        return new DataCount(sum);
    }

    private extractRangeFromPair(pair: RangePair) {
        if (pair.left > pair.right) {
            pair.swap();
        }
        let dataPoints = new Array<number>();
        for (let i = pair.left; i <= pair.right; i++) {
            dataPoints.push(i);
        }
        return new DataRange(dataPoints, pair);
    }

    private getPagesIfHas(from: number, to: number) {
        let pair = new RangePair(from, to);
        let list = this.extractRangeFromPair(pair);
        let flatAvailable: number[] = [];
        for (let section of this.state.inputData) {
            for (let item of section.data) {
                flatAvailable.push(item);
            }
        }
        let retVal: number[] | undefined = [];
        if (list.data.every(function (page) {
            return flatAvailable.indexOf(page) !== -1;
        })) {
            for (let item of flatAvailable) {
                if (list.data.indexOf(item) !== -1) {
                    retVal.push(item);
                    for (let section of this.state.inputData) {
                        let index = section.data.indexOf(item);
                        if (index !== -1)
                            section.data.splice(index, 1);
                    }
                }
            }
        }
        else {
            retVal = undefined;
        }
        return retVal;
    }

    private getFromTo(total: number) {
        const { inputData } = this.state;
        let tempTotal = total;
        let rows: RangeInput[] = [];
        let count = 0;
        var index = 0;
        for (; index < inputData.length; index++) {
            if (tempTotal > 0) {
                if (inputData[index].data?.length >= tempTotal) {
                    count++;
                    break;
                }
                else {
                    tempTotal -= inputData[index].data.length;
                }
                count++;
                if (inputData[index].data.length === 0) {
                    count--;
                }
            }
        }

        if (count === 1) {
            let first = inputData[index].data;
            let fromPage = first[0];
            let toPage = fromPage;
            for (let i = 0; i < tempTotal;) {
                if (first[i + 1] !== undefined) {
                    if (first[i] + 1 !== first[i + 1]) {
                        toPage = first[i];
                        rows.push(new RangeInput(undefined, new RangePair(fromPage, toPage)));
                        for (let temp = fromPage; temp <= toPage; temp++) {
                            first.splice(first.indexOf(temp), 1);
                        }
                        fromPage = first[0];
                        tempTotal -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                        i = 0;
                    }
                    else {
                        i++;
                    }

                    if (first[i + 1] !== undefined) {
                        if (first[i - 1] + 1 !== first[i] && first[i] + 1 !== first[i + 1]) {
                            toPage = first[i];
                            rows.push(new RangeInput(undefined, new RangePair(fromPage, toPage)));

                            for (let temp = fromPage; temp <= toPage; temp++) {
                                first.splice(first.indexOf(temp), 1);
                            }
                            fromPage = first[0];
                            tempTotal -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                            i = 0;
                        }
                    }
                }
                else {
                    i++;
                }
            }
            toPage = first[tempTotal - 1];
            if (fromPage !== undefined && toPage !== undefined)
                rows.push(new RangeInput(undefined, new RangePair(fromPage, toPage)));
            for (let temp = fromPage; temp <= toPage; temp++) {
                first.splice(first.indexOf(temp), 1);
            }
        }
        else if (count > 1) {
            tempTotal = total;
            for (let pos = 0; pos < count; pos++) {
                let item: number[] | undefined = [];
                for (let c = 0; c < inputData.length; c++) {
                    if (inputData[c].data.length > 0) {
                        item = inputData[c].data;
                        break;
                    }
                }
                let originalLength = item.length;
                if (tempTotal > 0) {
                    let fromPage = item[0];
                    let toPage = fromPage;
                    for (let i = 0; i < item.length && i < tempTotal;) {
                        if (item[i + 1] !== undefined) {
                            if (item[i] + 1 !== item[i + 1]) {
                                toPage = item[i];
                                rows.push(new RangeInput(undefined, new RangePair(fromPage, toPage)));
                                for (let temp = fromPage; temp <= toPage; temp++) {
                                    item.splice(item.indexOf(temp), 1);
                                }
                                fromPage = item[0];
                                tempTotal -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                                originalLength -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                                i = 0;
                            }
                            else {
                                i++;
                            }
                            if (item[i + 1] !== undefined) {
                                if (item[i - 1] + 1 !== item[i] && item[i] + 1 !== item[i + 1]) {
                                    toPage = item[i];
                                    rows.push(new RangeInput(undefined, new RangePair(fromPage, toPage)));
                                    for (let temp = fromPage; temp <= toPage; temp++) {
                                        item.splice(item.indexOf(temp), 1);
                                    }
                                    fromPage = item[0];
                                    tempTotal -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                                    originalLength -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                                    i = 0;
                                }
                            }
                        }
                        else {
                            i++;
                        }
                    }
                    if (pos === count - 1) {
                        toPage = item[tempTotal - 1];
                    }
                    else {
                        toPage = item[originalLength - 1];
                    }
                    if (fromPage !== undefined && toPage !== undefined)
                        rows.push(new RangeInput(undefined, new RangePair(fromPage, toPage)));
                    for (let temp = fromPage; temp <= toPage; temp++) {
                        item.splice(item.indexOf(temp), 1);
                    }
                    tempTotal -= rows[rows.length - 1] ? rows[rows.length - 1].total || 0 : 0;
                }
            }
        }
        return rows;
    }

    private dataChangeHandler(rowIndex: number, rangeIndex: number, input: string, type: RangeInputUpdateType) {
        const { dataState, countStore, inputData } = this.state;
        let pageRange = dataState[rowIndex][rangeIndex];

        if (pageRange.total !== undefined) {
            if (pageRange.first !== undefined && pageRange.last !== undefined) {
                if (pageRange.valid) {
                    for (let set of inputData) {
                        let from = pageRange.first;
                        let to = pageRange.last;
                        pageRange.total = to - from + 1;
                        if (from >= (set.first as number) && to <= (set.last as number)) {
                            for (let pageNo = from; pageNo <= to; pageNo++) {
                                set.data.push(pageNo);
                            }
                            set.data.sort(function (a, b) {
                                return a - b;
                            });
                            countStore.used -= pageRange.total;
                            countStore.unUsed += pageRange.total;
                        }
                    }
                }
                pageRange.last = undefined;
                pageRange.first = undefined;
                pageRange.total = undefined;

                if (!pageRange.valid) {
                    pageRange.valid = true;
                    pageRange.error = undefined;
                }
            }
        }
        if (input) {
            switch (type) {
                case RangeInputUpdateType.From:
                    pageRange.first = parseInt(input);
                    break;
                case RangeInputUpdateType.To:
                    pageRange.last = parseInt(input);
                    break;
                case RangeInputUpdateType.Total:
                    pageRange.total = parseInt(input);
                    break;
            }
        }
        else {
            switch (type) {
                case RangeInputUpdateType.From:
                    pageRange.first = undefined;
                    pageRange.valid = true;
                    pageRange.error = undefined;
                    break;
                case RangeInputUpdateType.To:
                    pageRange.last = undefined;
                    pageRange.valid = true;
                    pageRange.error = undefined;
                    break;
                case RangeInputUpdateType.Total:
                    pageRange.total = undefined;
                    pageRange.valid = true;
                    pageRange.error = undefined;
                    break;
            }
        }

        if (pageRange.first === undefined && pageRange.last === undefined && pageRange.total === undefined) {
            if (dataState[rowIndex].length > 1) {
                dataState[rowIndex].splice(rangeIndex, 1);
            }
        }
        this.setState(state => {
            return { dataState, countStore, inputData };
        });
    }

    private dataUpdateCallback(rowIndex: number, rangeIndex: number, input: string, type: RangeInputUpdateType) {
        if (input === undefined || input.length === 0)
            return;
        let parsedInput = parseInt(input);
        const { dataState, countStore } = this.state;
        if (type === RangeInputUpdateType.From || type === RangeInputUpdateType.To) {
            let tempTotal = 0;
            let entity = dataState[rowIndex][rangeIndex];
            switch (type) {
                case RangeInputUpdateType.From:
                    entity.first = parsedInput;
                    break;
                case RangeInputUpdateType.To:
                    entity.last = parsedInput;
                    break;
            }
            if (entity.first !== undefined && entity.last !== undefined && entity.total === undefined) {
                tempTotal = entity.last - entity.first + 1;
                let pages: number[] | undefined = undefined;
                if (entity.last >= entity.first)
                    pages = this.getPagesIfHas(entity.first, entity.last);
                if (pages === undefined) {
                    if (entity.valid) {
                        entity.valid = false;
                        entity.error = ErrorList.InvalidInputError;
                    }
                }
                else {
                    entity.valid = true;
                    entity.error = undefined;
                    entity.total = tempTotal;
                    countStore.used += tempTotal;
                    countStore.unUsed -= tempTotal;
                }
            }
            else if (entity.first === undefined && entity.last === undefined) {
                if (dataState[rowIndex].length > 1) {
                    dataState[rowIndex].splice(rangeIndex, 1);
                }
            }
        }
        else {
            let tempTotal = 0;
            let entity = dataState[rowIndex][rangeIndex];
            entity.total = parsedInput;
            if (entity.total !== undefined) {
                if (entity.first === undefined || entity.last === undefined) {
                    tempTotal = entity.total;
                    let pages: RangeInput[] | undefined = undefined;
                    if (entity.total <= countStore.unUsed)
                        pages = this.getFromTo(entity.total);
                    if (pages === undefined) {
                        if (entity.valid) {
                            entity.valid = false;
                            entity.error = ErrorList.InvalidInputError;
                        }
                    }
                    else {
                        if (pages.length === 1) {
                            entity.first = pages[0].first;
                            entity.last = pages[0].last;
                            entity.total = pages[0].total;
                        }
                        if (pages.length > 1) {
                            dataState[rowIndex].splice(rangeIndex, 1);
                            let subRowNumber = rangeIndex;
                            for (let page of pages) {
                                let newEntity = new RangeInput(undefined, new RangePair(page.first as number, page.last as number));
                                dataState[rowIndex].splice(subRowNumber, 0, newEntity);
                                subRowNumber++;
                            }
                        }
                        if (entity.valid === false) {
                            entity.valid = true;
                            entity.error = undefined;
                        }
                        countStore.used += tempTotal;
                        countStore.unUsed -= tempTotal;
                    }
                }
            }
            else {
                if (entity.first === undefined && entity.last === undefined) {
                    if (dataState[rowIndex].length > 1) {
                        for (let rowset of dataState[rowIndex]) {
                            if (!rowset.valid) {
                                rowset.valid = true;
                                rowset.error = undefined;
                            }
                            dataState[rowIndex].splice(rangeIndex, 1);
                        }
                    }
                }
            }
        }
        this.setState(state => {
            return {
                dataState,
                countStore
            };

        });
    }

    private addRow(rowIndex: number) {
        const { dataState } = this.state;
        if (!dataState[rowIndex].some((row) => {
            return row.total === undefined;
        })) {
            dataState[rowIndex].push(new RangeInput(undefined, undefined));
            this.setState({ dataState });
        }
    }

    private inputParser(range: string) {
        this.setState({ errors: [], originalInput: range }, () => {
            try {
                if (range === StringConstants.EmptyString)
                    range = this.props.init || StringConstants.EmptyString;
                const parsedData = this.inputParserCore(range);
                this.setState({
                    errors: [],
                    inputData: parsedData,
                    countStore: this.getCountFromData(parsedData),
                    dataState: this.GetEmptyDataState(),
                    originalInput: range
                });
            }
            catch (e) {
                const parsedData: DataRange[] = [];
                this.setState(state => ({
                    errors: [e as Error],
                    inputData: parsedData,
                    countStore: this.getCountFromData(parsedData),
                    dataState: this.GetEmptyDataState()
                }));
            }
        });
    }

    componentDidMount() {
        if (this.props.init) {
            this.inputParser(this.props.init);
        }
    }

    private inputParserCore(input: string) {
        input = input.replace(new RegExp(RegexPattern.CharacterPattern, 'g'), StringConstants.EmptyString);
        input = input.replace(new RegExp(RegexPattern.SpacePattern, 'g'), StringConstants.EmptyString);
        let isInputFormatValid = this.ValidateRegex(input);
        if (!isInputFormatValid) {
            throw ErrorList.InvalidInputFormatError;
        }
        let chunks = input.split(',');
        let pairs = new Array<RangePair>();
        chunks.forEach(chunk => {
            let range = chunk.split('-');
            let pair = new RangePair(parseInt(range[0]), range.length > 1 ? parseInt(range[1]) : parseInt(range[0]));
            pairs.push(pair);
        });
        let dataRanges = new Array<DataRange>();
        pairs.forEach(pair => {
            dataRanges.push(this.extractRangeFromPair(pair));
        });
        let tempValues = new Set<number>();
        for (let range of dataRanges) {
            for (let value of range.data) {
                if (!tempValues.has(value)) {
                    tempValues.add(value);
                }
                else {
                    throw ErrorList.DuplicateInputError;
                }
            }
        }
        return dataRanges;
    }

    private ValidateRegex(input: string) {
        let validInputRegex = new RegExp(RegexPattern.InputPattern);
        let isInputFormatValid = validInputRegex.test(input);
        return isInputFormatValid;
    }

    render() {
        return this.props.children({
            dataUpdateCallback: this.dataUpdateCallback,
            addRow: this.addRow,
            inputParser: this.inputParser,
            dataChangeHandler: this.dataChangeHandler,
            dataState: this.state.dataState,
            errors: this.state.errors,
            originalInput: this.state.originalInput,
            countStore: this.state.countStore,
            customErrors: this.props.customErrors
        } as IOutputPropsInterface);
    }
}