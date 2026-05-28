const dataStore = require("../store/dataStore");

function receiveData(req, res) {
    const { eau, electricite } = req.body;

    dataStore.setLastData({
        eau,
        electricite
    });

    res.json({ status: "stored", eau, electricite });
}

module.exports = { receiveData };