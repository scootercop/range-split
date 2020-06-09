export const ErrorList = {
    InvalidInputError: new Error("Invalid Input"),
    InvalidInputFormatError: new Error("Invalid input format"),
    DuplicateInputError: new Error("Inputs contain duplicate items"),
};

export const StringConstants = {
    EmptyString: "",
    InputPlaceholder: "input values"    
};

export const RegexPattern = {
    InputPattern : "^((?<word>([a-zA-Z]*))(\\d)+(([-]\\k<word>(\\d)+){0,1}))([,]{1}((\\k<word>)(\\d)+(([-](\\k<word>)(\\d)+){0,1})))*$",
    CharacterPattern: "[a-zA-Z]",
    SpacePattern: "[ ]"
};