class ICapteur {
    constructor() {
        if (new.target === ICapteur) {
            throw new Error("Cannot instantiate interface");
        }
    }

    lire() {
        throw new Error("Must implement lire()");
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = ICapteur;