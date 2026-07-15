export const masterDataKeyGenerator = (filter = {}) => {
    const sortedKeys = Object.keys(filter).sort();

    const filterParts = sortedKeys.map(key => `${key}:${filter[key]}`);
    return `masterData:${filterParts.join(':')}`;
};