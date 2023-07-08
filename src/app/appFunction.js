export const isSpecialCharacters = (value) => {
    //các ký tự đặc biệt
    let regex = /[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/
    if (regex.test(value)) {
        return false;
    }
    return true;
}

export const isText = (value) => {
    //các ký tự đặc biệt
    let regex = /[~`!@#$%\^&*()+=\-_\[\]\\';,/{}|\\":<>\?0-9]/
    if (regex.test(value)) {
        return false;
    }
    return true;
}

export const isDecimalNumber = (value) => {
    const regex = /^(-?\d+)(\.\d{1,2})?$/;
    if (regex.test(value)) {
        return true;
    }
    return false;
}