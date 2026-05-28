const GereConsommation = require('./GereConsommation');

function calculerConsommation(type) {
    return GereConsommation.calculerConsommation(type);
}

module.exports = {
    calculerConsommation
};