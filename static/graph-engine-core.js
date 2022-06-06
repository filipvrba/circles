/**
 * Module Description
 *
 * @version 22.a0513
 * @date 2022
 * @author Filip Vrba
 * @remarks This file is autogenerated.
 * @github https://github.com/filipvrba/graph 
 */

class Dispatcher {

    #signals;

    constructor() {

        this.#signals = undefined;

    }

    connect( type, signal ) {

        if ( this.#signals === undefined ) {

            this.#signals = {};

        }

        const signals = this.#signals;

        if ( signals[type] === undefined ) {

            signals[type] = [];

        }

        if ( signals[type].indexOf(signal) === -1 ) {

            signals[type].push(signal);

        }

    }

    disconect( type, signal ) {

        if (this.#signals === undefined) return;

        const signals = this.#signals;
        const signalArray = signals[type];

        if ( signalArray !== undefined ) {

            const index = signalArray.indexOf(signal);

            if ( index !== -1 ) {

                signalArray.splice(index, 1);

            }
            
        }

    }

    hasSignal( type, listener ) {

		if ( this.#signals === undefined ) return false;

		const listeners = this.#signals;

		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

	}

    emitSignal( signal ) {

        if (this.#signals === undefined) return;

        const signals = this.#signals;
        const signalArray = signals[signal.type];

        if (signalArray !== undefined) {

            signal.target = this;

            if ( signal.type === 'added' && typeof signal.target.ready === 'undefined' ) {

                return;

            }

            const array = signalArray.slice(0);

            for (let i = 0, l = array.length; i < l; i++) {

                array[i].call(this, signal);

            }

            signal.target = null;

        }
    }
    
}

// 0
class BasicObject extends Dispatcher {

    constructor() {

		super();
		
		this.id = undefined;
		this.parent = null;
		this.children = [];

    }

	// Add children
    add(object, id = undefined) {
		if (object === this) { 
			console.error('BasicObject.add: object can\'t be added as a child of itself.', object);
			return this;
		}

		if (object) {
			if (object.parent !== null) {
				object.parent.remove(object);
			}

			object.parent = this;

			if (object.id === undefined) object.id = id;

			this.children.push(object);

			if ( typeof object.updateGlobalPosition !== 'undefined' ) {

				object.updateGlobalPosition();

			}

			object.connect('added', () => {

                object.ready();

                if ( id ) {

                    this.getScene( true ).emitSignal({ type: 'ready', id });
                }
            });
			object.emitSignal({ type: 'added' });

			object.updateHandler = (signal) => {

				if ( typeof object.update !== 'undefined' ) {
					
					object.update( signal.dt );

				}

			}
			this.getScene( true ).connect( 'update', object.updateHandler );

			object.drawHandler = (signal) => {

				if ( typeof object.draw !== 'undefined' ) {

					object.draw( signal.renderer );

				}

			}
			this.getScene( true ).connect( 'draw', object.drawHandler );

			object.inputHandler = ( signal ) => {

				if ( typeof object.input !== 'undefined' ) {

					object.input( signal );

				}

			}

			this.getScene( true ).connect( 'input', object.inputHandler );

		} else {
			console.error('BasicObject.add: object not an instance of BasicObject.', object);
		}

		return this;
	}

	// Remove children
	remove(object) {
		const index = this.children.indexOf(object);
		if (index !== - 1) {
			object.parent = null;
			this.children.splice(index, 1);
		}

		return this;
	}

	free() {

		if ( this.children.length > 0 ) {

			for ( let i = 0; i < this.children.length; i++ ) {

				// Free next children
				this.children[i].free();
				this.children[i].freeSignals();

			}

		} else {

			this.freeSignals();

		}
	}

	freeSignals() {

		if ( this.hasSignal( 'added', this.ready ) ) {

			this.disconect( 'added', this.ready );

		}

		if ( this.getScene( true ).hasSignal( 'update', this.updateHandler ) ) {

			this.getScene( true ).disconect( 'update', this.updateHandler );

		}

		if ( this.getScene( true ).hasSignal( 'draw', this.drawHandler ) ) {

			this.getScene( true ).disconect( 'draw', this.drawHandler );

		}

		if ( this.getScene( true ).hasSignal( 'input', this.inputHandler ) ) {

			this.getScene( true ).disconect( 'input', this.inputHandler )

		}

	}

	getScene( isRoot = false ) {

        let scene = this;
        let parent = scene.parent;

        while( true ) {

            if ( isRoot ) {

                if ( parent === null ) break;
                
            } else {

                const extendClass = Object.getPrototypeOf(
                    Object.getPrototypeOf( parent )).constructor.name;

                if ( parent.constructor.name === NAME_SCENE ||
                    extendClass === NAME_SCENE ) {

                    scene = parent;
                    break;
                }
            }
            
            scene = parent;
            parent = scene.parent;
        }

        return scene;
    }

	findChildren( id ) {

		for (let i = 0; i < this.children.length; i++) {

			if ( this.children[i].id === id ) {
				
				return this.children[i];

			}

		}

		return null;

	}

}

// 1
class Object2D extends BasicObject {

	#globalPosition;

	constructor() {

		super();

		this.position = new Vector2(0, 0);
		this.#globalPosition = new Vector2(0, 0);

		this.animations = [];
		
	}

	get globalPosition() {

		this.updateGlobalPosition();

		return this.#globalPosition;

	}

	set globalPosition( vector ) {

		this.#globalPosition = vector;

	}

	updateGlobalPosition() {

		if (this.parent === null) return;

		const addX = this.position.x + this.parent.#globalPosition.x;
		const addY = this.position.y + this.parent.#globalPosition.y;

		if ( this.#globalPosition.equals( addX, addY ) ) return;

		this.#globalPosition = this.parent.#globalPosition.clone();
		this.#globalPosition.add( this.position );

	}

	updateWorld() {

		if ( this.children.length > 0 ) {

			for ( let i = 0; i < this.children.length; i++ ) {

				if ( typeof this.children[i].updateGlobalPosition !== 'undefined' ) {

					this.children[i].updateGlobalPosition();
					this.children[i].updateWorld();

				}

			}

		} else {

			if ( typeof this.updateGlobalPosition !== 'undefined' ) {

				this.updateGlobalPosition();

			}

		}
    
    }

}

// 2
class Collision extends BasicObject {

    constructor() {

        super();

        this.inputPickable = false;

    }

    input( mousePos ) {

        if ( !this.inputPickable && this.isCollide( mousePos ) ) {

            this.mouseEntered();
            this.inputPickable = true;

        } else if ( this.inputPickable && !this.isCollide( mousePos ) ) {

            this.mouseExited();
            this.inputPickable = false;
        
        }

    }

    mouseEntered() {
        
        this.emitSignal( { type: 'mouseEntered' } );

    }

    mouseExited() {

        this.emitSignal( { type: 'mouseExited' } );

    }

    isCollide( mousePos ) {

        const distanceRoot = mousePos.distanceTo( this.parent.globalPosition );

        if ( distanceRoot <= this.parent.values.widthRadius ) {

            const mousePosition = mousePos.clone();
            const direction = mousePosition.sub( this.parent.globalPosition );
            const radian = Math.atan2( -direction.y, -direction.x ) + Math.PI;

            return radian >= this.parent.startRadian && radian <= this.parent.endRadian;

        }

    }

}

const NAME_SCENE = 'Scene';

const PROCESS = 0;
const STOP = 1;
const SUM = 2;
class Input extends BasicObject {

    constructor() {

        super();

        this.position = new Vector2( 0, 0 );

        this.mouseMoveHandler = ( event ) => this.mouseMove( event );
        this.clickHandler = (event) => this.clickWindow( event );

        this.init();
    }

    init() {

        this.isMouseActive = false;
    }

    ready() {

        document.addEventListener( 'mousemove', this.mouseMoveHandler );
        document.addEventListener( 'mousedown', this.clickHandler );
        document.addEventListener( 'mouseup', this.clickHandler );
    }

    draw( renderer ) {

        this.canvasRect = renderer.canvas.getBoundingClientRect();

    }

    emit() {

        this.parent.emitSignal( { type: 'input', mousePosition: this.position,
        mouseActive: this.isMouseActive } );
    }

    mouseMove( event ) {

        this.position.x = event.x - this.canvasRect.left;
        this.position.y = event.y - this.canvasRect.top;

        this.emit();
    }

    clickWindow( event ) {

        switch (event.type) {

            case "mousedown":
                this.isMouseActive = true;
                break;
            case "mouseup":
                this.init();
                break;
        }

        this.emit();
    }

    free() {

        super.free();
        
        document.removeEventListener( 'mousemove', this.mouseMoveHandler );
        document.removeEventListener( 'mousedown', this.clickHandler );
        document.removeEventListener( 'mouseup', this.clickHandler );
    }

}


class TDRenderer {

    constructor( canvas ) {

        this.canvas = canvas;
        this.clock = new Clock();

    }

    setSize( width, height ) {

        this.canvas.width = width
        this.canvas.height = height;

    }

    get renderer() {

        return this.canvas.getContext( '2d' );

    }

    render( scene ) {

        this.renderer.clearRect( 0, 0, this.canvas.width,
            this.canvas.height );

        scene.emitSignal( { type: 'draw', renderer: this.renderer } );
        scene.emitSignal( { type: 'update', dt: this.clock.getDT() } );

    }

}

class Vector2 {

	constructor( x = 0, y = 0 ) {

		this.x = x;
		this.y = y;

	}

	length() {

		const x = this.x;
		const y = this.y;

		return Math.sqrt(x * x + y * y);

	}

	lerp( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	}

	normalize() {

		let x = this.x;
		let y = this.y;

		let l = x * x + y * y;

		
		
		if (l !== 0) {

			l = Math.sqrt( l );
			this.x /= l;
			this.y /= l;

		}

		return this;

	}

	normalized() {

		const v = this.clone();
		v.normalize();

		return v;

	}

	multiply( vector ) {

		this.x *= vector.x;
		this.y *= vector.y;

		return this;

	}

	multiplyScalar( scalar ) {

		this.x *= scalar;
		this.y *= scalar;

		return this;

	}

	clone() {

		return new this.constructor( this.x, this.y );

	}

	add( vector ) {

		this.x += vector.x;
		this.y += vector.y;

		return this;

	}

	equals( x, y ) {

		return ( ( x === this.x ) && ( y === this.y ) );

	}

	distanceTo( vector ) {

		return Math.sqrt( this.distanceToSquared( vector ) );

	}

	distanceToSquared( v ) {

		const dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	}

	dot( v ) {

		return this.x * v.x + this.y * v.y;

	}

	sub( v ) {

		this.x -= v.x;
		this.y -= v.y;

		return this;

	}

	subScalar( scalar ) {

		this.x -= scalar;
		this.y -= scalar;

		return this;

	}
}

class Color {

    constructor( rgb ) {

        if ( !rgb ) {

            /**
             * Colors palette - ZUGHY 32
             * https://lospec.com/palette-list/zughy-32
             */
            this.colors = [
                '#472d3c',
                '#5e3643',
                '#7a444a',
                '#a05b53',
                '#bf7958',
                '#eea160',
                '#f4cca1',
                '#b6d53c',
                '#71aa34',
                '#397b44',
                '#3c5956',
                '#302c2e',
                '#5a5353',
                '#7d7071',
                '#a0938e',
                '#cfc6b8',
                '#dff6f5',
                '#8aebf1',
                '#28ccdf',
                '#3978a8',
                '#394778',
                '#39314b',
                '#564064',
                '#8e478c',
                '#cd6093',
                '#ffaeb6',
                '#f4b41b',
                '#f47e1b',
                '#e6482e',
                '#a93b3b',
                '#827094',
                '#4f546b'
            ];

            this.bitMask = 0;

        } else {

            this.r = rgb.r;
            this.g = rgb.g;
            this.b = rgb.b;

        }

    }

    lerp( color, alpha ) {

		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;

		return this;

	}

    getRandomPalettte() {

        const idRandom = Math.floor( Math.random() * this.colors.length );
        const idMask = 2 ** idRandom;

        if ( ( this.bitMask & idMask ) !== 0 ) {

            return this.getRandomPalettte();

        } 

        this.bitMask |= idMask;

        return this.colors[ idRandom ];

    }

    toString() {

        return `rgb(${ this.r }, ${ this.g }, ${ this.b })`;

    }

    static ranColorStyle() {

        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

    }

}


class Mathf {
    static radians(degrees) {
        return degrees * Math.PI / 180;
    }

    static degrees(radians) {

        return radians * 180 / Math.PI;

    }

    static per2deg(percentage) {
        return (percentage / 100) * 360;
    }

    static percentage(min, max) {
        return (100 * min) / max;
    }

    static lerp(value1, value2, alpha) {

		return( value2 - value1 ) * alpha;
	}

    static lerp2( a, b, t ) {

		return a + ( b - a ) * t;

	}

    static radianToVector( radian ) {

        return new Vector2( Math.cos( radian ), Math.sin( radian ) );

	}
}

class Clock {
    #time;
    #fpsTime;
    #fps;

    constructor() {

        this.#time = Date.now();
        this.#fpsTime = 0;
        this.#fps = 0;
    }

    getDT() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.#time) / 1000;
        this.#time = currentTime;
        return deltaTime;
    }

    getFPS( dt ) {

        this.#fpsTime += dt;

        if ( this.#fpsTime >= 1 )
        {
            this.#fpsTime = 0;
            this.#fps = parseInt( 1 / dt );
        }

        return this.#fps;
    }
}


class Scene extends Object2D {

    constructor() {
        
        super();
    }

    ready() {

        if ( !this.parent ) {

            this.globalPosition = this.position;
            
            const input = new Input();
            this.add( input );
        }
    }
}


class AnimationPlayer extends BasicObject {

    constructor() {

        super();

        this.animations = new Map();

        this.defaultValues();

    }

    defaultValues() {

        this.valuesMask = new Array();
        this.animation = new Map();
        this.historyAnim = { };  // no called

        this.time = 0;
        this.lastTime = 0;  // no called
        this.playbackActive = false;
        this.valueZERO = null;  // no called
        this.currentAnimation = null;  // The name of the currently playing animation.
        
    }

    update( dt ) {

        if ( ! this.playbackActive ) return;

        this.time += dt;

        let attributeID = 0;
        this.animation.tracks.forEach( ( attributeValues, attributeName ) => {

            this.updateAnimation( dt, { values: attributeValues,
                name: attributeName, id: attributeID } );

            attributeID++;

        });

        if ( this.isAnimFinish( ) ) {

            this.animationFinished();

        }

    }

    animationFinished() {

        this.emitSignal( { type: "animFinish", name: this.currentAnimation } );

        this.defaultValues();

    }

    isAnimFinish( ) {

        let sum = 0;
        let stop = 0;
        for ( let i = 0; i < this.valuesMask[ SUM ].length; i++ ) {

            sum += this.valuesMask[ SUM ][ i ];
            stop += this.valuesMask[ STOP ][ i ];

        }

        return sum === stop;

    }

    updateAnimation( dt, object ) {

        let valueID = 0;
        object.values.forEach( ( value, time ) => {

            this.updateAnimValue( dt, { attribute: object, values: { 
                value: value,
                time: time,
                id: valueID
            } } );
            
            valueID++;

        });

    }

    updateAnimValue( dt, object ) {

        if ( ( this.valuesMask[ PROCESS ][ object.attribute.id ] & this.getUniqueID( object ) ) !== 0 && 
            ( this.valuesMask[ STOP ][ object.attribute.id ] & this.getUniqueID( object ) ) === 0 ) {

            this.processAnim( dt, object );

        }

        this.defStopAnim( object );

    }

    processAnim( dt, object ) {

        const arrayAttributeValues = Array.from( this.animation.tracks.get( object.attribute.name ) );
        const lastValues = arrayAttributeValues[ object.values.id - 1 ];

        const time = ( object.values.value - lastValues[ 1 ] ) / ( object.values.time - lastValues[ 0 ] ) * dt;

        const applyString = `this.parent.${ object.attribute.name } += ${ time };`;
        eval( applyString );

    }

    defStopAnim( object ) {

        if ( this.time >= object.values.time &&
            ( this.valuesMask[ STOP ][ object.attribute.id ] & this.getUniqueID( object ) ) === 0 ) {

            const applyString = `this.parent.${ object.attribute.name } = ${ object.values.value };`;
            eval( applyString );

            this.valuesMask[ STOP ][ object.attribute.id ] |= this.getUniqueID( object );
            this.valuesMask[ PROCESS ][ object.attribute.id ] |= this.getUniqueID( object, 1 );

        }

    }

    getUniqueID( object, add = 0 ) {

        return 2 ** ( object.attribute.id + object.values.id + add );

    }

    addAnimation( name, animation ) {

        this.animations.set( name, animation );

    }

    play( name ) {

        if ( ! this.animations.has(name) ) return;

        this.currentAnimation = name;
        this.animation = this.animations.get(name);

        // Define BitMask on values for attribute
        // 0 - Process
        // 1 - Stop
        // 2 - Sum
        this.valuesMask = new Array( 3 );

        for ( let i = 0; i < this.valuesMask.length; i++ ) {

            this.valuesMask[ i ] = new Array( this.animation.tracks.size );

        }

        this.defStartAnim();

        // Play update function
        this.playbackActive = true;

    }

    defStartAnim() {

        let attributeID = 0;
        this.animation.tracks.forEach( ( attributeValues ) => {

            let valuesID = 0;
            attributeValues.forEach( ( values ) => {

                const object = { attribute: { id: attributeID }, values: { id: valuesID } };
                this.valuesMask[ SUM ][ attributeID ] |= this.getUniqueID( object );

                valuesID++;

            });
           

            attributeID++;

        });

    }

    stop( reset = true ) {

        this.defaultValues();

    }

}

class Animation {

    constructor() {

        this.tracks = new Map();

    }

    addTrack( objectAttribute ) {

        this.tracks.set( objectAttribute, new Map() );

        return objectAttribute;

    }

    addInsertKey( id, time, key ) {

        this.tracks.get(id).set( time, key );

    }

}

class WindowRootElement extends HTMLElement {

    constructor() {

        super();
        this.resizeHandler = () => this.resize();

        this.initCanvas();
        this.initRenderer();
        
        this.scene = new Scene();
        this.scene.ready();
    }

    get globalPosition() {

        // Center position
        const widthHalf = this.renderer.canvas.width / 2;
        const heightHalf = this.renderer.canvas.height / 2;

        return new Vector2( widthHalf, heightHalf );
    }

    initCanvas() {

        const template = document.createElement( 'template' );
        template.innerHTML = `
            <style type="text/css">
                canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    outline: none;
                    z-index: -1;
                }
            </style>
            <canvas></canvas>
        `;
        
        this.attachShadow( { mode: 'open' } );
        this.shadowRoot.appendChild( template.content.cloneNode( true ) );
    }

    initRenderer() {

        const canvas = this.shadowRoot.querySelector( 'canvas' );

        this.renderer = new TDRenderer( canvas );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    tick() {

        this.renderer.render( this.scene );

        requestAnimationFrame( () => this.tick() );
    }

    resize() {

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        // this.scene.updateWorld();
    }

    setZIndex( index = -1 ) {

        this.renderer.canvas.style.zIndex = index;
    }

    connectedCallback() {

        this.tick();

        window.addEventListener( 'resize', this.resizeHandler );
    }

    disconnectedCallback() {

        this.scene.free();
        
        window.removeEventListener( 'resize', this.resizeHandler );
    }
}

window.customElements.define( 'window-root', WindowRootElement );