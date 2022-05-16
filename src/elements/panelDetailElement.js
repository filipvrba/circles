class PanelDetailElement extends HTMLElement {

    constructor() {

        super();

        this.detailHandler = (event) => this.detail(event.detail);
        this.plusHandler = () => this.changeCirclesCount( PARAMETERS.circles );
        this.minusHandler = () => this.changeCirclesCount( -PARAMETERS.circles );

        this.init();

        this.fps = document.getElementById( FPS );
        this.circles = document.getElementById( CIRCLES );
        this.plus = document.getElementById( PLUS );
        this.minus = document.getElementById( MINUS );
        this.panel = document.getElementById( PANEL_ID );

        this.visible( PARAMETERS.isPanel );
    }

    init() {

        const template = `
            <div id="${ PANEL_ID }" class="${ PANEL_ID }">
                <div class="labels">
                        <p id="${ FPS }" class="${ FPS }" ><strong>0 fps</strong></p>
                        <p id="${ CIRCLES }" class="${ CIRCLES }"><strong>0</strong></p>
                </div>
                <div class="buttons">
                    <button id="${ PLUS }" class="${ PLUS }" type="button">+</button>
                    <button id="${ MINUS }" class="${ MINUS }" type="button">-</button>
                </div>
            <div>
        `;
        
        this.innerHTML = template;
    }

    visible( isPanel ) {

        if ( isPanel )
            return;

        this.panel.style.display = "none";
    }

    detail( detail ) {

        this.fps.innerHTML = `<strong>${ detail.fps } fps</strong>`;
        this.circles.innerHTML = `<strong>${ detail.circles }</strong>`;
    }

    changeCirclesCount( circles ) {

        document.dispatchEvent( new CustomEvent( CHANGE_CIRCLE, {
            detail: {
                circles: circles
            }
        }));
    }

    connectedCallback() {

        document.addEventListener( PANEL, this.detailHandler );

        this.plus.addEventListener( CLICK, this.plusHandler );
        this.minus.addEventListener( CLICK, this.minusHandler );
    }

    disconnectedCallback() {

        document.removeEventListener( PANEL, this.detailHandler );

        this.plus.removeEventListener( CLICK, this.plusHandler );
        this.minus.removeEventListener( CLICK, this.minusHandler );
    }
}

export { PanelDetailElement }