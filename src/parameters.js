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

    getParameter( key ) {

        const address = window.location.search;
        const parameterList = new URLSearchParams( address );
    
        return parameterList.get( key );
    }
}

const PARAMETERS = new Parameters();