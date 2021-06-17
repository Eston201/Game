import * as THREE from '../js/three.module.js';
import {GLTFLoader} from '../js/GLTFLoader.js';
export {Boss}
class Boss {

  constructor(params) {
    this.init(params);
  }

  init(params){
    this.params = params;
    this.loader = new GLTFLoader();
    this.health = 1000;
    this.isAlive = true;
    this.LoadBoss();

  }

  LoadBoss(){
      this.loader.load( './resources/spacecraft by thomas mattia/Boss2.gltf',( gltf ) =>{
      this.Boss=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Boss.scale.set(5,5,5);
      this.Boss.position.set(0,0,-1000);
      this.Boss.visible=false;
      this.params.scene.add( this.Boss );
     });
  }
  makeVisible(){
    this.Boss.visible=true;;
  }
  Update(){

  }
}
