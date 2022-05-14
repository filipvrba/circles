import { Circle } from './circle.js';
import { WindowCollision } from '../components/windowCollision.js';

class Root extends Scene {

    constructor( window ) {

        super();
        this.resizeHandler = () => this.resize();
        this.changeCircleHandler = (event) => this.changeCirclesCount( event.detail.circles );

        this.id = this.constructor.name;
        
        // Window
        this.window = window;
        WindowRootElement.prototype.collision = new WindowCollision( this.window );

        // Helper
        BasicObject.prototype.root = this;

        // Circles
        this.circles = new Object2D();
        this.updateCirclesPosition();
    }

    ready() {
        
        // Events
        window.addEventListener( 'resize', this.resizeHandler );
        document.addEventListener( CHANGE_CIRCLE, this.changeCircleHandler );

        // Add's new objects
        this.window.scene.add( this.window.collision );
        this.add( this.circles );
        this.createCircle( 100 );
    }

    update( dt ) {

        document.dispatchEvent( new CustomEvent( PANEL, {
            detail: {
                fps: this.window.renderer.clock.getFPS( dt ),
                circles: this.circles.children.length
            }
        }));
    }

    createCircle( circleCount ) {

        for ( let i = 0; i < circleCount; i++ ) {

            const circle = new Circle();
            this.circles.add( circle );
        }
    }

    removeCircle( circleCount ) {

        const children = this.circles.children;
        const testChildrenCount = children.length -
            Math.abs(circleCount);

        if ( children.length <= 0 )
            return;
        else if ( testChildrenCount < 0 )
            circleCount = children.length;
        
        for ( let i = 1; i <= Math.abs(circleCount); i++ ) {

            const circleID = children.length - 1;
            children[circleID].freeSignals();
        }
    }

    resize() {

        this.updateCirclesPosition();
        this.window.scene.updateWorld();
    }

    changeCirclesCount( circles ) {

        if ( circles > 0 ) {

            this.createCircle( circles );
        }
        else {

            this.removeCircle( circles );
        }
    }

    updateCirclesPosition() {

        this.circles.position = this.window.globalPosition;
    }

    free() {

        super.free();

        window.removeEventListener( 'resize', this.resizeHandler );
        document.removeEventListener( CHANGE_CIRCLE, this.changeCircleHandler );
    }
}

export { Root }