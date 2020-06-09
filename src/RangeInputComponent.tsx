
import React from 'react';
import { RangeInput } from './RangeInputClass';
import { ErrorMessageComponent } from './ErrorMessageComponent';
import { RangeInputUpdateType } from './Enums';

interface IRangeInputProps {
    dataUpdateCallback: (rowIndex: number, rangeIndex: number, input: string, type: RangeInputUpdateType) => void;
    dataChangeHandler: (rowIndex: number, rangeIndex: number, input: string, type: RangeInputUpdateType) => void;
    rowIndex: number;
    rangeIndex: number;
    rowData: RangeInput;
    customErrors: boolean;
}


export class RangeInputComponent extends React.Component<IRangeInputProps> {
    constructor(props: IRangeInputProps) {
        super(props);
        this.fromUpdateHandler = this.fromUpdateHandler.bind(this);
        this.toUpdateHandler = this.toUpdateHandler.bind(this);
        this.totalUpdateHandler = this.totalUpdateHandler.bind(this);
        this.fromDataChangeHandler = this.fromDataChangeHandler.bind(this);
        this.toDataChangeHandler = this.toDataChangeHandler.bind(this);
        this.totalDataChangeHandler = this.totalDataChangeHandler.bind(this);
    }

    fromUpdateHandler(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dataUpdateCallback(this.props.rowIndex, this.props.rangeIndex, e.target.value, RangeInputUpdateType.From);
    }

    toUpdateHandler(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dataUpdateCallback(this.props.rowIndex, this.props.rangeIndex, e.target.value, RangeInputUpdateType.To);
    }

    totalUpdateHandler(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dataUpdateCallback(this.props.rowIndex, this.props.rangeIndex, e.target.value, RangeInputUpdateType.Total);
    }

    fromDataChangeHandler(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dataChangeHandler(this.props.rowIndex, this.props.rangeIndex, e.target.value, RangeInputUpdateType.From);
    }

    toDataChangeHandler(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dataChangeHandler(this.props.rowIndex, this.props.rangeIndex, e.target.value, RangeInputUpdateType.To);
    }

    totalDataChangeHandler(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dataChangeHandler(this.props.rowIndex, this.props.rangeIndex, e.target.value, RangeInputUpdateType.Total);
    }


    render() {
        const { rowData, customErrors } = this.props;
        return (
            <>
                <div className="rg-rangeInput-row">
                    <span className="rg-from">
                        <input type="number" onBlur={this.fromUpdateHandler} value={rowData.first || ''} onChange={this.fromDataChangeHandler} />
                    </span>
                    <span className="rg-to">
                        <input type="number" onBlur={this.toUpdateHandler} value={rowData.last || ''} onChange={this.toDataChangeHandler} />
                    </span>
                    <span className="rg-total">
                        <input type="number" onBlur={this.totalUpdateHandler} value={rowData.total || ''} onChange={this.totalDataChangeHandler} />
                    </span>
                </div>
                {rowData.error ? <ErrorMessageComponent error={rowData.error} customErrors={customErrors} /> : null}
            </>
        );
    }
}