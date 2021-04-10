export default class CaseInsensitiveDictionary {
    private normalizedValues = {};

    constructor(data: any) {
        const normalizedValues = {};

        for (const prop of Object.keys(data)) {
            normalizedValues[prop.toLowerCase()] = data[prop];
        }
    }

    getByKey(key: string) {
        return this.normalizedValues[key.toLowerCase()];
    }
}