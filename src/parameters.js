class Parameters {

    get isPanel() {

        let parameter = this.getParameter( PANEL_ID );

        if ( parameter === null || parameter === TRUE )
            parameter = true;
        else
            parameter = false;
        
        return parameter;
    }

    get circles() {

        let parameter = this.getParameter( CIRCLES );
        parameter = parseInt( parameter );

        if ( !parameter )
            parameter = CIRCLES_GROUP;

        return parameter;
    }

    get speed() {

        return this.getArray( SPEED, SPEED_DEFINED );
    }

    get radius() {

        return this.getArray( RADIUS, RADIUS_DEFINED );
    }

    getArray( key, array ) {

        let parameter = this.getParameterArray( key, array );

        const min = this.changeNumber( parameter[ ZERO ], array[ ZERO ] );

        if ( parameter.length === ONE )
            parameter = [ min, min ];
        else if ( parameter.length > ONE ) {

            const max = this.changeNumber( parameter[ ONE ], array[ ONE ] );
            parameter = [ min, max ];
        }

        return parameter;
    }

    getParameterArray( key, array ) {

        const parameter = this.getParameter( key );
        
        if ( !parameter )
            return array;
        
        return parameter.split( '-' );
    }

    getParameter( key ) {

        const address = window.location.search;
        const parameterList = new URLSearchParams( address );
    
        return parameterList.get( key );
    }

    changeNumber( value, number ) {

        let valueNumber = parseInt( value );
        if ( !valueNumber ) {

            valueNumber = number;
        }

        return valueNumber;
    }
}

const PARAMETERS = new Parameters();