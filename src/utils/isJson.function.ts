export function isJson(item: string): boolean {
    item = typeof item !== "string" ? JSON.stringify(item) : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    return typeof item === "object" && item !== null;
}