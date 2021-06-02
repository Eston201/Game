export{Level1}
import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import {planet} from './planet.js';
import {enemy} from './enemies.js'
class Level1 {
  constructor() {
    this.init();

  }

  init(){
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1000);


      this.renderer = new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.camera.position.set( 5, 30, 60 );
      // this.controls.update();

      window.addEventListener('resize',()=>{
      this.OnWindowResize();
      },false)


      this.params = {
        camera: this.camera,
        scene: this.scene,
      }
      //kinda like a skybox but better
      const loader = new THREE.CubeTextureLoader();
      const texture = loader.load([
       '../resources/skybox/corona_ft.png',
       '../resources/skybox/corona_bk.png',
       '../resources/skybox/corona_up.png',
       '../resources/skybox/corona_dn.png',
       '../resources/skybox/corona_rt.png',
       '../resources/skybox/corona_lf.png',
     ]);
     this.scene.background = texture;

     //Lights
     //directionalLight
     const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
     directionalLight.position.set(0,10,0)
     this.scene.add( directionalLight );
     //AmbientLight
     const amblight = new THREE.AmbientLight(0x404040 ,2);
     this.scene.add(amblight);

     this.LoadPlayer();


     this.planetArr = [];
     this.addplanets();

      this.spawnEnemyShip();


     this.previousFrame = null;//used for counting frames to get delta times
     this.RAF();

  }


  LoadPlayer(){
    this.myRocket = new player(this.params);
  }
  spawnEnemyShip(){
    const params = {
      camera: this.camera,
      scene: this.scene,
      target: this.myRocket.enemy
    }
    this.e1 = new enemy(params);

  }
  loadplanets(){
    const params = {
      camera: this.camera,
      scene: this.scene,
    }
    return new planet(params);

  }


  OnWindowResize(){
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect=window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  RAF() {
    requestAnimationFrame((t) => {
      if (this.previousFrame === null) {
        this.previousFrame = t;
      }

      this.RAF();
      this.Step(t - this.previousFrame);
      this.renderer.render(this.scene, this.camera);
      this.previousFrame = t;
    });
  }

  Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    if (this.myRocket) {
      this.myRocket.Update(timeElapsedS);
    }
    if (this.e1) {
      this.e1.Update(timeElapsedS);
    }
    for (var i = 0; i < this.planetArr.length; i++) {
      this.planetArr[i].animate();
    }
  }

  addplanets(){
    this.p1 = this.loadplanets()
    this.p1.planet.position.set(600,-400,500);
    this.scene.add(this.p1.planet);
    this.planetArr.push(this.p1);

    this.p2 = this.loadplanets()
    this.p2.planet.position.set(-500,50,20);
    this.scene.add(this.p2.planet);
    this.planetArr.push(this.p2);

    this.p3 = this.loadplanets()
    this.p3.planet.position.set(1220,180,-200);
    this.scene.add(this.p3.planet);
    this.planetArr.push(this.p3);

    this.p4 = this.loadplanets()
    this.p4.planet.position.set(700,600,-50);
    this.scene.add(this.p4.planet);
    this.planetArr.push(this.p4);

    this.p5 = this.loadplanets()
    this.p5.planet.position.set(6,40,500);
    this.scene.add(this.p5.planet);
    this.planetArr.push(this.p5);
  }


};


// window.addEventListener('DOMContentLoaded', () => {
//   const lv1 = new Level1();
// });
