import { Movement } from '../components/movement.js';
import { MathExtension } from '../mathExtension.js';

class Circle extends Scene {

    constructor() {

        super();

        this.id = this.constructor.name;
        this.widthRadius = PARAMETERS.radius;
        this.color;
        this.speed = PARAMETERS.speed;
        this.movement = new Movement( this.speed );
    }

    ready() {

        this.add( this.movement );

        this.widthRadius = MathExtension.getRandomArbitrary(
            this.widthRadius[0],
            this.widthRadius[1]
        );
        this.color = Color.ranColorStyle();
    }

    draw( renderer ) {

        renderer.beginPath();
        
        renderer.arc(this.globalPosition.x, this.globalPosition.y,
            Math.abs( this.widthRadius ),
        0, Math.PI * 2, false);

        renderer.closePath();

        renderer.fillStyle = this.color;
        renderer.fill();
    }

    freeSignals() {

        super.free();
        super.freeSignals();

        if ( this.parent )
            this.parent.remove( this );
    }
}

export { Circle }
