import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import {ThirdPersonCamera} from './ThirdPersonCamera.js';

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

     this.previousFrame = null;//used for counting frames to get delta times
     this.RAF();

  }


  LoadPlayer(){

    const params = {
      camera: this.camera,
      scene: this.scene,
    }
    this.controls = new player(params);
    // this.thirdPersonCamera = new ThirdPersonCamera({
    //   camera: this.camera,
    //   target: this.controls,
    // });
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

    if (this.controls) {
      this.controls.Update(timeElapsedS);
    }
    // this.thirdPersonCamera.Update(timeElapsedS);
  }



};


window.addEventListener('DOMContentLoaded', () => {
  const lv1 = new Level1();
});
