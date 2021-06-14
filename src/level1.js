export{Level1}
import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import {Planet} from './planet.js';
import { Portal} from './Objects.js';
import {enemy} from './enemies.js'
import {is_collision} from './is_collision.js';

class Level1 {
  constructor() {

    this.init();
  }



  init(){

    this.pause = false;
    this.GameOver = false;  

    //listens for Esc to pause the game
    window.addEventListener("keydown", (e)=>{
      this.isPaused(e);
    }, true);
    //get the pause menu in the html file
    this.pauseMenu=document.getElementById('pauseMenu');

    this.scene = new THREE.Scene();
    this.portal;
    this.reachedGoal = false;
    this.enemyplanes = [];
    this.delay = 0;  // delay before spawning new enemyplane
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 5000);
    this.objects = []; //objects in space except planets

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
    this.planetArr = [];
    this.loadPlanets();

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
   directionalLight.position.set(0,1000,0)
   this.scene.add( directionalLight );

   //AmbientLight
   const amblight = new THREE.AmbientLight(0x404040 ,2);
   this.scene.add(amblight);

   this.placePortal();  //set position of portal
   this.LoadPlayer();

    //guide to the end
   this.loadGreatLight();

   this.previousFrame = null;//used for counting frames to get delta times
   //resume button
   this.btnResume = document.getElementById("Resume");
   this.btnResume.onclick =()=>{
     //set pause to false to resume animation
     this.pause=false;
   }

  var Restart = document.getElementById("Restart");
     Restart.onclick = ()=>{
      this.RestartLevel();
  }
     
 this.RAF();


}

  newPlanet(texture){
    const params = {
      camera: this.camera,
      scene: this.scene,
    }
    return new Planet(params,texture);

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
      this.torus.rotateY(Math.PI/100);
      this.updateSpaceObjects();
      if(!this.pause){
        this.checkIfReachedGoal();
        this.checkPlayerHealth();
        this.updateGreatLight();
        this.spawnEnemies();
        this.updateEnemyPlanes();
      }
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

    for (var i = 0; i < this.planetArr.length; i++) {
      this.planetArr[i].animate();
    }
    //this.updateGreatLight();


    for (var i = 0; i < this.enemyplanes.length; i++) {
      this.enemyplanes[i].Update(timeElapsedS);
    }
  }

  createCylinder(){
    var cyl = new THREE.Mesh(new THREE.CylinderGeometry( 200, 200, 500, 32 ), new THREE.MeshPhongMaterial({color: 0xfc038c, opacity: 0.9, transparent: true}));
    this.scene.add(cyl);
    this.objects.push(cyl);
    return cyl;
  }

  loadPlanets(){

    for(var z = -5000; z < 10000; z = z + 200){
      var texture = Math.floor(Math.random() * (3 - 1) + 1); 
      var x = Math.floor(Math.random() * (1500 - (-1500)) + (-1500)); 
      var y = Math.floor(Math.random() * (2000 - (-2000)) + (-2000)); 
      var planetObject = this.newPlanet(texture);
      planetObject.addBelt();
      planetObject.planet.position.set(x,y,-z);
      this.planetArr.push(planetObject);
     }
     for(var z = 0; z < 10000; z = z + 1000){
       var x = Math.floor(Math.random() * (-1500 - (-5000)) + (-5000)); 
       var y = Math.floor(Math.random() * (2000 - (-2000)) + (-2000)); 
       var cyl = this.createCylinder();
       cyl.position.set(x,y,-z);
     }
  }

  updateSpaceObjects(){
    for(var index = 0; index < this.objects.length; index = index+1){
        var object = this.objects[index];
        object.rotateX(Math.PI/250);
        object.rotateZ(Math.PI/200);
        object.translateX(1);
    }
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
    this.camera.lookAt(this.myRocket.prod.position);
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

  checkIfReachedGoal(){
    if(is_collision(this.torus,this.portal,3)){
        this.reachedGoal = true;
    }
  }

  spawnEnemies(){
    //console.log(this.delay);
    if(this.delay == 1000){  // spawn new enemy 
      let randomNum = Math.floor(Math.random() * (500 - 100) + 100);   // random number between 
      var enemyPlane = this.spawnEnemyShip();
      enemyPlane.enemy.position.set(this.myRocket.prod.position.x + randomNum, this.myRocket.prod.position.y, this.myRocket.prod.position.z);
      this.enemyplanes.push(enemyPlane);
      this.delay = 0;
    }

    this.delay = this.delay + 1
  }

  updateEnemyPlanes(){
    for(var index = 0; index < this.enemyplanes.length; index = index+1){
      var enemy = this.enemyplanes[index];
      if(enemy.dead){
        this.enemyplanes.splice(index,1);  // remove dead enemy plane from list
      }
    }
  }

  placePortal(){  //set portal location
    this.portal = new Portal(0);
    this.portal.rotateX(Math.PI/2);
    this.portal.scale.set(2,2,2);
    this.portal.position.set(0,0,-10000);  //set portal position
    this.scene.add(this.portal);
  }

  RestartLevel(){    //clear the scene then reload everything
    this.scene.clear();
     const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
     directionalLight.position.set(0,10,0)
     this.scene.add( directionalLight );
     const amblight = new THREE.AmbientLight(0x404040 ,2);
     this.scene.add(amblight);
     this.scene.add(this.portal);
     this.LoadPlayer();
     this.loadGreatLight();
     this.loadPlanets();
     this.enemyplanes = []; this.enemyplanes.length = 0; 
     this.pause = false;
  }


};


// window.addEventListener('DOMContentLoaded', () => {
//   const lv1 = new Level1();
// });
