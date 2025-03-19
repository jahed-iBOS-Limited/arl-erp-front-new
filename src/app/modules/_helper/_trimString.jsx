export function trimString(param) {
    if (typeof param === 'string') {
        return param.trim();
    }
    return param;
}