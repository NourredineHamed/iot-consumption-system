const service = require("../service/consommationService");
const dataStore = require("../store/dataStore");

function getConsommation(req, res) {

    const type = req.params.type;

    const valeur = service.calculerConsommation(type);

    res.json({
        type,
        consommation: valeur
    });
}

module.exports = { getConsommation };