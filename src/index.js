import { Root } from './scenes/root.js'

const windowRoot = document.querySelector( 'window-root' );
const root = new Root( windowRoot );

windowRoot.scene.add( root );