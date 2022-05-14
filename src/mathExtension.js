class MathExtension {

    static getRandomValue( value ) {

        return this.getRandomArbitrary( -value / 2, value / 2 );
    }

    static getRandomArbitrary( min, max ) {

        return Math.random() * (max - min) + min;
    }
}

export { MathExtension }