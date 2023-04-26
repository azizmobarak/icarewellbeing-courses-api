export function getAddedByOrID(decodedToken: string): string {
    const role = getRole(decodedToken)
    switch (role) {
        case '2':
            return getAddedByID(decodedToken)
        default:
            return getUserID(decodedToken)
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
