export const masterDataKeyGenerator = (filter = {}) => {
    const sortedKeys = Object.keys(filter).sort();

    if (sortedKeys.length === 0) {
        return 'masterData:all';
    }

    const filterParts = sortedKeys.map(key => `${key}:${filter[key]}`);
    return `masterData:${filterParts.join(':')}`;
};