class ParametersElement extends HTMLElement {

  constructor() {
      super();

      this.init();
  }

  init() {

      const template = `
        <ul>
            <li>
                <p><strong>${ PANEL_ID }</strong></p>
                <ul>
                    <li>
                        <p>Zapíná a vypíná panel.</p>
                    </li>
                    <li>
                        <p><i>Příklad:</i> ${ PANEL_ID }=false</p>
                    </li>
                </ul>
            </li>
            <li>
                <p><strong>${ SPEED }</strong></p>
                <ul>
                    <li>
                        <p>Změní pohyblivost kruhů. Lze nastavit od a do.</p>
                    </li>
                    <li>
                        <p><i>Příklad:</i> ${ SPEED }=100-500; ${ SPEED }=100</p>
                    </li>
                </ul>
            </li>
            <li>
                <p><strong>${ RADIUS }</strong></p>
                <ul>
                    <li>
                        <p>Změní velikost kruhů. Lze nastavit od a do.</p>
                    </li>
                    <li>
                        <p><i>Příklad:</i> ${ RADIUS }=20-60; ${ RADIUS }=20</p>
                    </li>
                </ul>
            </li>
            <li>
            <p><strong>${ CIRCLES }</strong></p>
            <ul>
                <li>
                    <p>Změní počet kruhů při vytváření a odebírání.</p>
                </li>
                <li>
                    <p><i>Příklad:</i> ${ CIRCLES }=50</p>
                </li>
            </ul>
        </li>
        </ul>
      `;
      
      this.innerHTML = template;
  }
}

export { ParametersElement }
