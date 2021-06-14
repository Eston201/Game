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

      this.pause =false;
      this.GameOver = false;



      //listens for Esc to pause the game
      window.addEventListener("keydown", (e)=>{
        this.isPaused(e);
      }, true);
      //get the pause menu in the html file
      this.pauseMenu=document.getElementById('pauseMenu');



      this.scene = new THREE.Scene();
      this.reachedGoal = false;
      this.enemyplanes = [];

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);

      this.renderer = new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.camera.position.set( 0,30,60 );
      // this.controls.update()

      window.addEventListener('resize',()=>{
      this.OnWindowResize();
      },false)

      this.cursor = {
        x : this.camera.position.x,
        y : this.camera.position.y
      }
      window.addEventListener( 'mousemove',(event)=>{
        this.cursor.x =( event.clientX / window.innerWidth ) * 2 - 1;
        this.cursor.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      })

      this.params = {
        camera: this.camera,
        scene: this.scene,
        enemyplanes: this.enemyplanes
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

     const axesHelper = new THREE.AxesHelper( 5 );
     this.scene.add( axesHelper );
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

     //guide to the end
     this.loadGreatLight();

    this.e1 = this.spawnEnemyShip();
    this.e1.enemy.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y, this.myRocket.prod.position.z);

    this.enemyplanes.push(this.e1);
     this.previousFrame = null;//used for counting frames to get delta times
     //resume button
     this.btnResume = document.getElementById("Resume");
     this.btnResume.onclick =()=>{
       //set pause to false to resume animation
       this.pause=false;
     }

     //restart button still needs work
     // var Restart = document.getElementById("Restart");
     // Restart.onclick = ()=>{
     //   lv1=new Level1();
     // }


     this.RAF();



  }

  LoadPlayer(){
    this.myRocket = new player(this.params);

  }
  spawnEnemyShip(){
    const params = {
      camera: this.camera,
      scene: this.scene,
      target: this.myRocket
    }
    return new enemy(params);

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
      this.Updates(t - this.previousFrame);
      // this.updatecamera();

      this.checkPlayerHealth();
      this.updateGreatLight();
      this.updateEnemyPlanes();
      this.renderer.render(this.scene, this.camera);
      this.previousFrame = t;

    });
  }

  //update the scene/ objects /player..etc
  Updates(timeElapsed) {
    if(this.pause){
      this.pauseMenu.style.visibility = "visible";

      return;
  }
  else{
    this.pauseMenu.style.visibility = "hidden";
  }

    const timeElapsedS = timeElapsed * 0.001;
    //update the players ship
    if (this.myRocket) {
      this.myRocket.Update(timeElapsedS);
    }
    //enemy update still needs work
    if (this.e1) {
     this.e1.Update(timeElapsedS);
    }

    for (var i = 0; i < this.planetArr.length; i++) {
      this.planetArr[i].animate();
    }
    this.updateGreatLight();


    for (var i = 0; i < this.enemyplanes.length; i++) {
      this.enemyplanes[i].Update(timeElapsedS);
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

  loadGreatLight(){   // spot light, transparent cone and spinning torus
    this.GreatLight = new THREE.SpotLight( 0xffffff, 10, 5000, Math.PI/3 );
    this.GreatLight.position.set(0,50,-100);
    this.scene.add(this.GreatLight);

    const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    const material = new THREE.MeshPhongMaterial( { color: 0xffff00 , opacity: 1, transparent: true} );
    this.torus = new THREE.Mesh( geometry, material );
    this.torus.position.set(0,0,-100);
    this.scene.add( this.torus );
    this.GreatLight.target = this.torus;

    const coneGeometry = new THREE.ConeGeometry( 100, 10000, 50, 32 );
    const coneMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff, opacity: 0.3, transparent: true } );
    this.cone = new THREE.Mesh( coneGeometry, coneMaterial );
    this.cone.position.set(0,50,-100);
    this.scene.add( this.cone );
  }

  updateGreatLight(){ // stay 300 units ahead of player until reachedGoal
    if(!this.reachedGoal){
    this.torus.position.set(0,0,this.myRocket.prod.position.z-300);

    //light and cone continuously follow torus
    this.GreatLight.position.set(this.torus.position.x,this.torus.position.y+100,this.torus.position.z);
    this.cone.position.set(this.torus.position.x,this.torus.position.y,this.torus.position.z);
    }
    this.torus.rotateY(Math.PI/100);
  }

  updatecamera(){
    // this.camera.position.x = (this.cursor.x)*20;
    // this.camera.position.x += -(Math.sin(this.cursor.x*(Math.PI/2))*90);
    // // this.camera.position.z = Math.cos(this.cursor.x*(Math.PI/2))*3;
    // // this.camera.position.y+= ((this.cursor.y)*20);
    // this.camera.position.z = (this.myRocket.prod.position.z)+60
    // this.camera.lookAt(this.mycube.cube.position);
    this.camera.lookAt(this.myRocket.prod.position);
    // console.log(this.myRocket.prod.position);
  }

  //check  if user pauses and stops animation in loop
  isPaused(e){
    if(e.keyCode==27){
      this.pause = !this.pause;
    }
  }
  checkPlayerHealth(){  //check if player is dead
    if(this.myRocket.dead){
      this.GameOver = true;
    }
  }

  updateEnemyPlanes(){
    for(var index = 0; index < this.enemyplanes.length; index = index+1){
      var enemy = this.enemyplanes[index];
      if(enemy.dead){
        this.enemyplanes.splice(index,1);  // remove dead enemy plane from list
      }
    }
  }


};


// window.addEventListener('DOMContentLoaded', () => {
//   const lv1 = new Level1();
// });
