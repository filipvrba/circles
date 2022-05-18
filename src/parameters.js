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

        let parameter = this.getParameter( SPEED );
        parameter = parameter.split( '-' );

        if ( !parameter ) {

            return SPEED_DEFINED;
        }

        const min = this.changeNumber( parameter[ ZERO ], SPEED_DEFINED[ ZERO ] );

        if ( parameter.length === ONE )
            parameter = [ min, min ];
        else if ( parameter.length > ONE ) {

            const max = this.changeNumber( parameter[ ONE ], SPEED_DEFINED[ ONE ] );
            parameter = [ min, max ];
        }

        return parameter;
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