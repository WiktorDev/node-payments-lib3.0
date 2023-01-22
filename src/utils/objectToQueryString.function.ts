export function objectToQueryString(object: any): string{
    return Object.keys(object).map(key => key + '=' + object[key]).join('&')
}