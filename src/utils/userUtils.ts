export function getAddedByOrID(decodedToken: string): string {
    const role = getRole(decodedToken)
    console.log(decodedToken)
    switch (role) {
        case '2':
            return decodedToken.split(',')[2]
        default:
            console.log('current token but id', decodedToken.split(',')[0])
            return decodedToken.split(',')[0]
    }
}

export function getRole(decodedToken: string): string {
    return decodedToken.split(',')[1]
}

export function getAddedByID(decodedToken: string): string {
    return decodedToken.split(',')[2]
}

export function getUserID(decodedToken: string): string {
    return decodedToken.split(',')[0]
}
