import * as THREE from '../js/three.module.js';
import {GLTFLoader} from '../js/GLTFLoader.js';
export {SolarSystem}
class SolarSystem {

  constructor(params) {
    this.init(params);
  }

  init(params){
    this.params = params;
    this.loader = new GLTFLoader();
    //load the earth model
    this.Earth();

    //load the jupiter model
    this.jupiter();

    //load the Sun model
    this.Sun();

    //load the Venus model
    this.Venus();
    //load the Mars model
    this.Mars();

    //load the Saturn model
    this.Saturn();

    //load the Uranus model
    this.Uranus();

    //load the Neptune model
    this.Neptune();
  }

  Earth(){
    this.loader.load( '../resources/Planets/Earth/scene.gltf',( gltf ) =>{
      this.Earth=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Earth.scale.set(5,5,5);
      this.Earth.position.set(-1000,-250,-4000);
      this.Earth.visible=false;
      this.params.scene.add( this.Earth );

     });
  }

  jupiter(){
    this.loader.load( '../resources/Planets/jupiter/scene.gltf',( gltf ) =>{
      this.jupiter=gltf.scene;
      //set the scale,position and visibility(for later)
      this.jupiter.scale.set(9,9,9);
      this.jupiter.position.set(8000,0,-1250);
      this.jupiter.visible=false;
      this.params.scene.add( this.jupiter );

     });
  }
  Sun(){
    this.loader.load( '../resources/Planets/Sun/scene.gltf',( gltf ) =>{
      this.Sun=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Sun.scale.set(500,500,500);
      this.Sun.position.set(100,0,-500);
      this.Sun.visible=false;
      this.params.scene.add( this.Sun );

     });
  }

  Venus(){
    this.loader.load( '../resources/Planets/Venus/scene.gltf',( gltf ) =>{
      this.Venus=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Venus.scale.set(5,5,5);
      this.Venus.position.set(-3000,0,-250);
      this.Venus.visible=false;
      this.params.scene.add( this.Venus );

     });

  }

  Mars(){
    this.loader.load( '../resources/Planets/Mars/scene.gltf',( gltf ) =>{
      this.Mars=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Mars.scale.set(5,5,5);
      this.Mars.position.set(2000,0,-5000);
      this.Mars.visible=false;
      this.params.scene.add( this.Mars );

     });
  }

  Saturn(){
    this.loader.load( '../resources/Planets/Saturn/scene.gltf',( gltf ) =>{
      this.Saturn=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Saturn.scale.set(5,5,5);
      this.Saturn.position.set(5000,0,5000);
      this.Saturn.visible=false;
      this.params.scene.add( this.Saturn );

     });
  }
  Uranus(){
    this.loader.load( '../resources/Planets/Uranus/scene.gltf',( gltf ) =>{
      this.Uranus=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Uranus.scale.set(5,5,5);
      this.Uranus.position.set(500,0,7000);
      this.Uranus.visible=false;
      this.params.scene.add( this.Uranus );

     });
  }

  Neptune(){
    this.loader.load( '../resources/Planets/Neptune/scene.gltf',( gltf ) =>{
      this.Neptune=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Neptune.scale.set(5,5,5);
      this.Neptune.position.set(-4000,0,5000);
      this.Neptune.visible=false;
      this.params.scene.add( this.Neptune );

     });
  }

  //make all the models vissible in the scene
  makeVisible(){
    this.Earth.visible=true;
    // this.gui.add(this.Earth.position,'x').min(-1000000).max(1000000).step(0.1).name('Earth X');
    // this.gui.add(this.Earth.position,'y').min(-1000000).max(1000000).step(0.1).name('Earth Y');
    // this.gui.add(this.Earth.position,'z').min(-1000000).max(1000000).step(0.1).name('Earth Z');

    this.jupiter.visible=true;
    // this.gui.add(this.jupiter.position,'x').min(-1000000).max(1000000).step(0.1).name('jupiter X');
    // this.gui.add(this.jupiter.position,'y').min(-1000000).max(1000000).step(0.1).name('jupiter Y');
    // this.gui.add(this.jupiter.position,'z').min(-1000000).max(1000000).step(0.1).name('jupiter Z');

    this.Sun.visible=true;
    // this.gui.add(this.Sun.position,'x').min(-1000000).max(1000000).step(0.1).name('Sun X');
    // this.gui.add(this.Sun.position,'y').min(-1000000).max(1000000).step(0.1).name('Sun Y');
    // this.gui.add(this.Sun.position,'z').min(-1000000).max(1000000).step(0.1).name('Sun Z');

    this.Venus.visible=true;
    // this.gui.add(this.Venus.position,'x').min(-1000000).max(1000000).step(0.1).name('Venus X');
    // this.gui.add(this.Venus.position,'y').min(-1000000).max(1000000).step(0.1).name('Venus Y');
    // this.gui.add(this.Venus.position,'z').min(-1000000).max(1000000).step(0.1).name('Venus Z');

    this.Mars.visible=true;
    // this.gui.add(this.Mars.position,'x').min(-1000000).max(1000000).step(0.1).name('Mars X');
    // this.gui.add(this.Mars.position,'y').min(-1000000).max(1000000).step(0.1).name('Mars Y');
    // this.gui.add(this.Mars.position,'z').min(-1000000).max(1000000).step(0.1).name('Mars Z');

    this.Saturn.visible=true;
    // this.gui.add(this.Saturn.position,'x').min(-1000000).max(1000000).step(0.1).name('Saturn X');
    // this.gui.add(this.Saturn.position,'y').min(-1000000).max(1000000).step(0.1).name('Saturn Y');
    // this.gui.add(this.Saturn.position,'z').min(-1000000).max(1000000).step(0.1).name('Saturn Z');

    this.Uranus.visible=true;
    // this.gui.add(this.Uranus.position,'x').min(-1000000).max(1000000).step(0.1).name('Uranus X');
    // this.gui.add(this.Uranus.position,'y').min(-1000000).max(1000000).step(0.1).name('Uranus Y');
    // this.gui.add(this.Uranus.position,'z').min(-1000000).max(1000000).step(0.1).name('Uranus Z');

    this.Neptune.visible=true;
    // this.gui.add(this.Neptune.position,'x').min(-1000000).max(1000000).step(0.1).name('Neptune X');
    // this.gui.add(this.Neptune.position,'y').min(-1000000).max(1000000).step(0.1).name('Neptune Y');
    // this.gui.add(this.Neptune.position,'z').min(-1000000).max(1000000).step(0.1).name('Neptune Z');
  }

};
