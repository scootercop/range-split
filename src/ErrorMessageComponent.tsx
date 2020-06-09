import React from "react";

interface IErrorMessageProps {
    error: Error;
    customErrors: boolean;
}

export class ErrorMessageComponent extends React.Component<IErrorMessageProps>{
    render() {
        const { error, customErrors } = this.props;
        return !customErrors && error ? (
            <div className="rs-error-msg">
                {error.message}
            </div>
        ) : null;
    }
}
