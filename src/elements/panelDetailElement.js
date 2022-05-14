class PanelDetailElement extends HTMLElement {

    constructor() {

        super();

        this.detailHandler = (event) => this.detail(event.detail);
        this.plusHandler = () => this.changeCirclesCount( CIRCLES_GROUP );
        this.minusHandler = () => this.changeCirclesCount( -CIRCLES_GROUP );

        this.init();

        this.fps = this.shadowRoot.getElementById( FPS );
        this.circles = this.shadowRoot.getElementById( CIRCLES );
        this.plus = this.shadowRoot.getElementById( PLUS );
        this.minus = this.shadowRoot.getElementById( MINUS );
    }

    init() {

        const template = document.createElement( 'template' );
        template.innerHTML = `
            <style type="text/css">
                .panel {

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin: 0 10%;

                    background-color: rgba(64, 64, 64, 0.3);

                    border-style: solid;
                    border-radius: 30px;
                    border-color: rgba(41, 41, 41, 0.3);
                }

                .panel > div {

                    margin: 5px 20px 5px 20px;
                }

                .labels {

                    display: flex;
                }

                .labels > p {

                    margin: 20px
                }

                .buttons {

                    display: flex;
                }

                .buttons > button {

                    margin: 10px;
                }

                button {

                    width: 40px;
                    cursor: pointer;
                }
            </style>
            <div class="panel">
                <div class="labels">
                    <p id="${ FPS }" class="${ FPS }" >0 fps</p>
                    <p id="${ CIRCLES }" class="${ CIRCLES }">0</p>
                </div>
                <div class="buttons">
                    <button id="${ PLUS }" class="${ PLUS }" type="button">+</button>
                    <button id="${ MINUS }" class="${ MINUS }" type="button">-</button>
                </div>
            <div>
        `;
        
        this.attachShadow( { mode: 'open' } );
        this.shadowRoot.appendChild( template.content.cloneNode( true ) );
    }

    detail( detail ) {

        this.fps.innerHTML = `${ detail.fps } fps`;
        this.circles.innerHTML = `${ detail.circles }`;
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