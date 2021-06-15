import * as THREE from '../js/three.module.js';
export {controls}
class controls {
  constructor() {
    this.init();
  }

  init(){

    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
      EKey: false,
      QKey: false,
      fpc: false,
      VKey: false,
      BKey: false,
      Lclick:false,
      Esc:false
    };

    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    document.addEventListener( 'mousedown', (e) => this.onDocumentMouseDown(e), false );
    document.addEventListener('mouseup', (e) => this.mouseUp(e), false);

  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      case 16: // SHIFT
        this._keys.shift = true;
        break;
      case 69: // E key
        this._keys.EKey = true;
        break;
      case 81: // E key
        this._keys.QKey = true;
        break;
      case 67://c key
        this._keys.fpc = true;
        break;
      case 86: //v
        this._keys.VKey = true;
        break;
      case 66://r
        this._keys.BKey = true;
        break;
      case 27://ESC
        this._keys.Esc = true;
        break;
    }
  }

  onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this._keys.forward = false;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      case 16: // SHIFT
        this._keys.shift = false;
        break;
      case 69: // E key
        this._keys.EKey = false;
        break;
      case 81: // Q key
        this._keys.QKey = false;
        break;
      case 67:
        this._keys.fpc = false;
        break;
      case 86:
          this._keys.VKey = false;
          break;
      case 66:
          this._keys.BKey = false;
          break;
      case 27://ESC
          this._keys.Esc = false;
          break;
    }
  }
  onDocumentMouseDown(event){

    switch (event.which) {
       case 1:
           this._keys.Lclick = true;
           break;
       // case 2:
       //     alert('Middle Mouse button pressed.');
       //     break;
       // case 3:
       //     alert('Right Mouse button pressed.');
       //     break;
       // default:
       //     alert('You have a strange Mouse!');
   }
  }
  mouseUp(){
    switch (event.which) {
       case 1:
           this._keys.Lclick = false;
           break;
       // case 2:
       //     alert('Middle Mouse button pressed.');
       //     break;
       // case 3:
       //     alert('Right Mouse button pressed.');
       //     break;
       // default:
       //     alert('You have a strange Mouse!');
   }
  }


};
