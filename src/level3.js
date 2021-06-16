
import * as THREE from '../js/three.module.js';
import {player} from './spaceship.js';
import {SolarSystem} from './SolarSystem.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {Particles} from './particles.js'
import {GLTFLoader} from '../js/GLTFLoader.js';
import * as dat from '../js/dat.gui.module.js'
export{Level3}

class Level3 {
  constructor() {
    this.init();
  }

  init(){
      this.frameNo=0;
      //debugging
      this.gui = new dat.GUI();
      this.enemyplanes = [];
      this.scene = new THREE.Scene();
      this.animate = true;
      // const axesHelper = new THREE.AxesHelper( 5 );
      // this.scene.add( axesHelper );
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 10000);
      this.rearcamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);  // press b
      this.frontcamera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,0.1, 1500);  //press v

      this.renderer = new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      // this.camera.position.set( 0,0,0 );
      this.camera.position.set( 0,30,60 );
      this.controls.update()

      window.addEventListener('resize',()=>{
      this.OnWindowResize();
      },false)
      this.params = {
        camera: this.camera,
        scene: this.scene,
        enemyplanes: this.enemyplanes
      }


      //directionalLight
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
      directionalLight.position.set(0,20,0)
      this.scene.add( directionalLight );
      const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 2.5 );
      directionalLight2.position.set(0,-40,0)
      this.scene.add( directionalLight2 );

      this.loader = new GLTFLoader();

      this.loadobjects();
      //particles
      this.particles();
      //white flash after hyperspace
      this.whiteflash();
      //players model
      this.LoadPlayer();
      //load the thruster sound
      this.ThrusterSound();
      this.loadBoss();
      //debugging
      this.previousFrame = null;//used for counting frames to get delta times
      this.RAF();
  }

  LoadPlayer(){
    this.myRocket = new player(this.params);
    this.rearcamera.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y+20, this.myRocket.prod.position.z-70);
    this.frontcamera.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y, this.myRocket.prod.position.z-30);
    this.rearcamera.lookAt(this.myRocket.prod.position);
    this.myRocket.prod.add(this.rearcamera);
    this.myRocket.prod.add(this.frontcamera);
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
      if(this.animate){

        this.Update(t - this.previousFrame);
      }
      else{
        this.Updates(t - this.previousFrame);
      }

      this.renderer.render(this.scene, this.camera);
      this.previousFrame = t;

    });
  }
  // update the scene/ objects /player..etc
  Update(timeElapsed) {
    // if(this.pause){
    //
    //   this.pauseMenu.style.visibility = "visible";
    //
    //   return;
    // }
    // else{
    //   this.pauseMenu.style.visibility = "hidden";
    // }

    const timeElapsedS = timeElapsed * 0.001;
    //update the players ship
    //traveling through hyperspace
    this.particle.update(timeElapsedS);
    if(this.particle.particles.position.z<10000){

      this.myRocket.ring1.rotation.y += 0.05;
      this.myRocket.ring2.rotation.x += 0.1;
      this.myRocket.shooter.rotation.z+=0.1;
    }

    //exiting...all the animations of stuff goes here
    else{
      //white flash is vissible
      this.flash.visible=true;
      //slowly decrease the value of alpha of the flash material to be transparent
      gsap.to(this.flashmat.uniforms.uAlpha,{duration:2,delay:1,value:0});
      //stop the animation of particles
      this.animate = false;
    }

  }

  Updates(timeElapsed){
    const timeElapsedS = timeElapsed * 0.001;
    //remove particles animation over
    this.scene.remove(this.particle.particles);
    //update players ship
    this.myRocket.Update(timeElapsedS);
    if(this.frameNo==0){
      this.SolarSystem.makeVisible();
      this.Boss.visible=true;
      this.gui.add(this.Boss.position,'x').min(-1000000).max(1000000).step(0.1).name('Boss X');
      this.gui.add(this.Boss.position,'y').min(-1000000).max(1000000).step(0.1).name('Boss Y');
      this.gui.add(this.Boss.position,'z').min(-1000000).max(1000000).step(0.1).name('Boss Z');
    }

      this.frameNo++

  }

  particles(){
    this.particle = new Particles({
      scene:this.scene,
      camera:this.camera
    });

  }

  whiteflash(){
    this.flashgeo = new THREE.PlaneBufferGeometry(2,2,1,1);
    this.flashmat = new THREE.ShaderMaterial({
    transparent:true,
    uniforms:{
      uAlpha: {value:1}
    },
    vertexShader:'void main(){gl_Position =  vec4(position,1.0);}',

    fragmentShader: ' uniform float uAlpha; void main(){ gl_FragColor = vec4(1.0,1.0,1.0,uAlpha);}'

    });
    this.flash = new THREE.Mesh(this.flashgeo,this.flashmat);
    this.flash.visible=false;
    this.scene.add(this.flash)
  }
  //load all the models
  loadobjects(){

    this.SolarSystem = new SolarSystem({
      scene:this.scene,
      camera:this.camera
    });

  }


  ThrusterSound(){
    const listener = new THREE.AudioListener();
    this.camera.add( listener );

    const audioLoader = new THREE.AudioLoader();

    //load ThrusterSound
    this.Thruster = new THREE.Audio( listener );

    audioLoader.load( '../resources/Audio/Thruster/thrusterFire_000.ogg',( buffer ) =>{

        this.Thruster.setBuffer( buffer );
        this.Thruster.setVolume( 0.5 );
        this.Thruster.setPlaybackRate(0.6);
        this.Thruster.play();

      } );
  }

  loadBoss(){
    this.loader.load( '../resources/Boss/scene.gltf',( gltf ) =>{
      this.Boss=gltf.scene;
      //set the scale,position and visibility(for later)
      this.Boss.scale.set(20,50,20);
      this.Boss.position.set(-1000,-250,-4000);
      this.Boss.visible=false;
      this.params.scene.add( this.Boss );

     });
  }

};
