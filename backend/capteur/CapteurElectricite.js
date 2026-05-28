const ICapteur = require('./ICapteur');

class CapteurElectricite extends ICapteur {
    constructor(options = {}) {
        super();
        this.simulate = options.simulate ?? true;
        this.min = options.min || 380;
        this.max = options.max || 520;
        this.fixedValue = options.fixedValue || 450;
    }

    lire() {
        return this.simulate
            ? this.randomInt(this.min, this.max)
            : Math.trunc(this.fixedValue);
    }
}

module.exports = CapteurElectricite;