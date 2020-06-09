import React from "react";
import { DataRange } from "./DataRangeClass";
import { ErrorMessageComponent } from "./ErrorMessageComponent";

interface IDataInputProps {
    inputParser: (input: string) => DataRange[];
    errors: Error[];
    customErrors: boolean
}

export class DataInputComponent extends React.Component<IDataInputProps>{
    constructor(props: IDataInputProps) {
        super(props);
        this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(e: any) {
        this.props.inputParser(e.target.value);
    }

    render() {
        return (
            <>
                <input className="rs-input" placeholder={"input values"} type="text" onBlur={this.inputHandler} />
                {this.props.errors.map(error =>
                    <ErrorMessageComponent error={error} customErrors={this.props.customErrors} />
                )}
            </>
        );
    }
}
