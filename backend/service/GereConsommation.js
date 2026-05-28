const TypeCapteur = require('../enum/TypeCapteur');
const CapteurEau = require('../capteur/CapteurEau');
const CapteurElectricite = require('../capteur/CapteurElectricite');
const dataStore = require('../store/dataStore');

class GereConsommation {
    constructor() {
        this.capteurs = {
            [TypeCapteur.EAU]: new CapteurEau(),
            [TypeCapteur.ELECTRICITE]: new CapteurElectricite()
        };
    }

    calculerConsommation(type) {

        const last = dataStore.getLastData();
        if (last && last[type] !== undefined) {
            return Math.trunc(last[type]);
        }

        const capteur = this.capteurs[type];
        return capteur ? Math.trunc(capteur.lire()) : 0;
    }
}

module.exports = new GereConsommation();