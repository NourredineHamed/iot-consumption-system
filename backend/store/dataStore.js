let lastData = null;

module.exports = {
    setLastData(data) {
        lastData = data;
    },

    getLastData() {
        return lastData;
    }
};