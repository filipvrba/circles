import { MathExtension } from '../mathExtension.js';

class Movement extends BasicObject {

    constructor( speed ) {

        super();
        this.edgeWindowHandler = () => this.edgeWindow();

        this.speed = speed;

        this.direction = new Vector2( 0, 0 );
        this.velocity = new Vector2( 0, 0 );
        this.isCollide = new Vector2( false, false );
    }

    ready() {

        this.setRandomDirection();
    }

    update( dt ) {

        const isCollide = this.root.window.collision.isCollide( this.parent );
        this.reverseDirection( isCollide );

        const speed = MathExtension.getRandomArbitrary(
            this.speed[0],
            this.speed[1]
        );
        this.velocity = this.direction.clone()
            .multiplyScalar( speed * dt );

        this.parent.position.x += this.velocity.x;
        this.parent.position.y += this.velocity.y;
    }

    reverseDirection( isCollide ) {

        if ( isCollide.x && !this.isCollide.x ) {

            this.isCollide.x = true;
            this.direction.x = -this.direction.x;
        }
        if ( isCollide.y && !this.isCollide.y ) {

            this.isCollide.y = true;
            this.direction.y = -this.direction.y;
        }

        if ( !isCollide.x && this.isCollide.x)
            this.isCollide.x = false;
        
        if ( !isCollide.y && this.isCollide.y)
            this.isCollide.y = false;
    }

    getRandomValue() {

        return MathExtension.getRandomArbitrary(
            -1, 1
        );
    }

    setRandomDirection() {

        this.direction.x = this.getRandomValue();
        this.direction.y = this.getRandomValue();
    }
}

export { Movement }