const service = require("../service/consommationService");
const dataStore = require('../store/dataStore');

describe("Consommation Tests", () => {

    beforeEach(() => {
        dataStore.setLastData({
            eau: 240,
            electricite: 800
        });
    });

    test("Eau consumption", () => {
        const result = service.calculerConsommation("eau");
        expect(result).toBe(240);
    });

    test("Electricity consumption", () => {
        const result = service.calculerConsommation("electricite");
        expect(result).toBe(800);
    });

   test("Unknown type returns undefined or 0", () => {
    const result = service.calculerConsommation("gaz");
    expect(result).toBe(0);
});
test("Handles empty data safely", () => {
    dataStore.setLastData({});
    const result = service.calculerConsommation("eau");
    expect(result).toBe(0);
});
test("Handles null data", () => {
    dataStore.setLastData(null);
    const result = service.calculerConsommation("eau");
    expect(result).toBe(0);
});
});