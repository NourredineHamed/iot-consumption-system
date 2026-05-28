const ICapteur = require('./ICapteur');

class CapteurEau extends ICapteur {
    constructor(options = {}) {
        super(options);
        // activer simulation si option simulate=true ou variable d'env SIMULATE_CAPTEURS === 'true'
        this.simulate = options.simulate === true || process.env.SIMULATE_CAPTEURS === 'true';
        // plage de simulation (litres ou unité choisie)
        this.min = options.min || 100;
        this.max = options.max || 140;
        // valeur fixe par défaut (utilisée si simulate=false)
        this.fixedValue = options.fixedValue || 120;
    }

    lire() {
        if (this.simulate) {
            return this.randomInt(this.min, this.max);
        }
        return Math.trunc(this.fixedValue);
    }
}

module.exports = CapteurEau;
