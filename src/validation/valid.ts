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
