export const validUserName = (str: string): boolean => {
    const regex: RegExp = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    
    if (regex.test(str)) {
        return true
    }

    return false
}

export const validNoEmpty = (str: string): boolean => {
  
    if (str !== "") {
        return true
    }

    return false
}

export const validEmail = (str: string): boolean => {
    const regex: RegExp =/^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    
    if (regex.test(str)) {
        return true
    }

    return false
}

export const validBirthday = (str: string): boolean => {
    const regex: RegExp =  /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    
    if (regex.test(str)) {
        return true
    }

    return false
}


export const validPassword = (str: string): boolean => {
    const regex: RegExp =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;
    
    if (regex.test(str)) {
        return true
    }

    return false
}

export const validName = (str: string): boolean => {
    const regex: RegExp =/^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
    
    if (regex.test(str)) {
        return true
    }

    return false
}