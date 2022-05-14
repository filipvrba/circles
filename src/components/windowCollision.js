class WindowCollision extends BasicObject {

    constructor( window ) {

        super();
        this.id = this.constructor.name;

        this.window = window;
    }

    isCollide( object2D ) {

        const MAX_DISTANCE_OFF = 100;

        const cx = object2D.globalPosition.x;
        const cy = object2D.globalPosition.y;
        const r = object2D.widthRadius;

        const rx = this.window.renderer.canvas.getBoundingClientRect().left;
        const ry = this.window.renderer.canvas.getBoundingClientRect().top;
        const rw = this.window.renderer.canvas.width;
        const rh = this.window.renderer.canvas.height;

        const map = new Vector2( false, false );

        if ( cx + rx + MAX_DISTANCE_OFF < r || cx > rw + MAX_DISTANCE_OFF - r ) {

            object2D.freeSignals();
        }
        else if ( cx + rx < r || cx > rw - r ) {

            map.x = true;
        }

        if ( cy + ry + MAX_DISTANCE_OFF < r || cy > rh + MAX_DISTANCE_OFF - r ) {

            object2D.freeSignals();
        }
        else if ( cy + ry < r || cy > rh - r ) {

            map.y = true;
        }

        return map;
    }
}

export { WindowCollision } 