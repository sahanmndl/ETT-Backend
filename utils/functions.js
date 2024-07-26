export const sortMapByDate = (map) => {
    try {
        const mapArray = Object.entries(map).map(([dateTime, amount]) => {
            return [dateTime, parseFloat(amount.toFixed(2))];
        });
        mapArray.sort((a, b) => new Date(a[0]) - new Date(b[0]));
        return Object.fromEntries(mapArray)
    } catch (e) {
        throw e;
    }
}