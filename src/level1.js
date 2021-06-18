export{Level1}
import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import {Planet} from './planet.js';
import { PlanetA, PlanetBelt } from './Objects.js';
import { Portal} from './Objects.js';
import {enemy} from './enemies.js'
import {is_collision} from './is_collision.js';
import {FontLoader} from '../js/three.module.js'

class Level1 {
  constructor() {

    this.init();
  }

  init(){

    this.pause = false;
    this.GameOver = false;
    this.keyboard = new THREEx.KeyboardState(); // for capturing key presses
    
    //listens for Esc to pause the game
    window.addEventListener("keydown", (e)=>{
      this.isPaused(e);
      this.changeCameraMode(e);
   }, true);

    //get the pause menu in the html file
    this.pauseMenu=document.getElementById('pauseMenu');
    this.gameOverMenu=document.getElementById('GameOverMenu');
    this.reachedGoalMenu=document.getElementById('ReachedGoalMenu');

    this.scene = new THREE.Scene();
    this.portal;
    this.torusreachedGoal = false;
    this.playerReachedGoal = false;
    this.enemyplanes = [];
    this.delay = 0;  // delay before spawning new enemyplane
    this.delay2 = 0;  //delay before spawning incoming space object
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight,0.1, 5000);
    this.rearcamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);  // press b
    this.frontcamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);  //press v
    this.cameraMode = 0;  //third person
    this.objects = []; //objects in space except planet
    this.healthboxes = [];
    this.loadedHealthBar = false; // check if health score been loaded;

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
   this.loadHealthBoxes();

   this.previousFrame = null;//used for counting frames to get delta times
   //resume button
   this.btnResume = document.getElementById("Resume");
   this.btnResume.onclick =()=>{
     //set pause to false to resume animation
     this.pause=false;
     document.body.style.cursor = 'none';
   }

   var Restart = document.getElementById("Restart");
     Restart.onclick = ()=>{
      this.RestartLevel();
      document.body.style.cursor = 'none';
  }
  var RestartfromGameOver = document.getElementById("restart1");
  RestartfromGameOver.onclick=()=>{
    //this.gameOver = false;
    this.RestartLevel();
    document.body.style.cursor = 'none';
  }

  var RestartfromReachedGoal = document.getElementById("restart2");
  RestartfromReachedGoal.onclick=()=>{
  this.RestartLevel();
  document.body.style.cursor = 'none';
  }


 this.loadIntro();
 this.RAF();


}

loadIntro(){
  const loader1 = new FontLoader();
  let myscene = this;
  loader1.load( '/resources/fonts/helvetiker_regular.typeface.json', function ( font ) {

      const tgeometry = new THREE.TextGeometry( 'Milky Way Galaxy', {
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 5,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
      } );
      const tgeometry2 = new THREE.TextGeometry( 'Void Axis', {
        font: font,
        size: 100,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 5,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    } );
    var mat = new THREE.MeshLambertMaterial({color:0x44cee3});

    var textmesh = new THREE.Mesh(tgeometry,mat);
    textmesh.position.set(-300,0,-400);
    var textmesh2 = new THREE.Mesh(tgeometry2,mat)
    textmesh2.position.set(-300,0,-9000);
    myscene.scene.add(textmesh);
    myscene.scene.add(textmesh2);
  } );
}

newPlanet(texture){
    const params = {
      camera: this.camera,
      scene: this.scene,
    }
    return new Planet(params,texture);

  }

  LoadPlayer(){
    const params = {
      camera: this.camera,
      scene: this.scene,
      enemyplanes: this.enemyplanes
    }
    this.myRocket = new player(params);
    this.rearcamera.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y+20, this.myRocket.prod.position.z-70);
    this.frontcamera.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y, this.myRocket.prod.position.z-30);
    this.rearcamera.lookAt(this.myRocket.prod.position);
    this.myRocket.prod.add(this.rearcamera);
    this.myRocket.prod.add(this.frontcamera);
  }
  spawnEnemyShip(){
    const params = {
      camera: this.camera,
      scene: this.scene,
      target: this.myRocket
    }
    return new enemy(params);

  }

  changeCameraMode(e){
    if(e.keyCode==86){            //if V is pressed change camera mode
      if(this.cameraMode == 0){
        this.cameraMode = 1;
      }
      else if(this.cameraMode == 1){
        this.cameraMode = 0;
      }
    }
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
      this.updateHealthBoxes();
      if(!this.pause && !this.GameOver){
        this.updateSpaceObjects();
        this.checkPlayerHealth();
        this.checkIfReachedGoal();
        this.updateGreatLight();
        this.spawnEnemies();
        this.updateEnemyPlanes();
        this.checkCollision();
      }
      this.renderScene();
      
  
      this.previousFrame = t;


    });
  }

  renderScene(){
    if(this.cameraMode == 0){
      this.renderer.render(this.scene,this.camera);
    }
    else if(this.cameraMode == 1){
      this.renderer.render(this.scene, this.frontcamera);
    }
    if(this.keyboard.pressed("b")){
      this.renderer.render(this.scene, this.rearcamera);
    }
  }

  //update the scene/ objects /player..etc
  Updates(timeElapsed) {
    if(this.pause){
      document.body.style.cursor = 'default';
      this.pauseMenu.style.visibility = "visible";

      return;
  }
  else{
    this.pauseMenu.style.visibility = "hidden";
  }

  if(this.GameOver){
    document.body.style.cursor = 'default';
    this.gameOverMenu.style.visibility = "visible";

    return;
  }
  else{
    this.gameOverMenu.style.visibility = "hidden";
  }
  if(this.playerReachedGoal){
    document.body.style.cursor = 'default';
    this.reachedGoalMenu.style.visibility = "visible";

    return;
  }else{
    this.reachedGoalMenu.style.visibility = "hidden";
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

  createCylinder(timeout){
    const cyltext = new THREE.TextureLoader().load(
        'resources/textures/cone1.jpg'
      );
    var cyl = new THREE.Mesh(new THREE.CylinderGeometry( 50, 100, 150, 32 ), new THREE.MeshBasicMaterial({map: cyltext}));
    cyl.isalive = true;
    cyl.type = 0; //type of space object to diiferentiate between space objects
    setTimeout(function(){
      cyl.isalive = false;
    }, timeout);
    this.scene.add(cyl);
    this.objects.push(cyl);
    return cyl;
  }

  loadPlanets(){

    for(var z = -10000; z < 20000; z = z + 1000){
      var texture = Math.floor(Math.random() * (4 - 1) + 1);
      var x = Math.floor(Math.random() * (2500 - (-2500)) + (-2500));
      var y = Math.floor(Math.random() * (2000 - (-2000)) + (-2000));
      var planetObject = this.newPlanet(texture);
      planetObject.planet.position.set(x,y,-z);
      planetObject.addBelt();
      this.planetArr.push(planetObject);
     }
  }

  updateSpaceObjects(){

      if(this.delay2 == 500){
        for(var i = 0; i < 3; i++){
        var cyl = this.createCylinder(15000);  // set timeout/lifetime
        cyl.position.set(this.myRocket.prod.position.x+250-(i * 250), this.myRocket.prod.position.y, this.myRocket.prod.position.z-600+ (i*200));
    }

        this.delay2 = 0;
     }
     this.delay2 ++;
    for(var index = 0; index < this.objects.length; index = index+1){
        var object = this.objects[index];
        if(!object.isalive){
          this.objects.splice(index,1);
        }
        object.rotateX(Math.PI/100);
        object.position.set(object.position.x,object.position.y,object.position.z+1);
    }
  }

  loadHealthBoxes(){
    // cube to guide the player to goal
    const geometry = new THREE.BoxGeometry(50,50,50);
    const material = new THREE.MeshPhongMaterial( { color: 0x48e2f0 ,opacity: 0.6, transparent: true} );
    var healthBox1 = new THREE.Mesh( geometry, material );
    healthBox1.position.set(0,-300,-4000);
    var healthBox2 = new THREE.Mesh( geometry, material );
    healthBox2.position.set(200,300,-8000);
    var healthBox3 = new THREE.Mesh( geometry, material );
    healthBox3.position.set(200,300,-13000);
    this.scene.add( healthBox1 );
    this.scene.add( healthBox2 );
    this.scene.add( healthBox3)
    this.healthboxes.push(healthBox1);
    this.healthboxes.push(healthBox2);
    this.healthboxes.push(healthBox3);
}

updateHealthBoxes(){
  for(var i = 0; i < this.healthboxes.length; i++){
    var healthbox = this.healthboxes[i];
    healthbox.rotation.y += 0.01;
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
    if(!this.torusreachedGoal){
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
    if(this.myRocket.prod.position.z < (this.portal.position.z)){  // if player missed portal, game over
      this.GameOver = true;
    }
  }

  checkIfReachedGoal(){
    if(is_collision(this.torus,this.portal,3)){
        this.torusreachedGoal = true;                    //check if great light has reached goal
    }
    var distToPortal = this.myRocket.prod.position.z - this.portal.position.z;
    if(is_collision(this.myRocket.prod, this.portal, 80) && Math.abs(distToPortal) < 5.5){ //check if player has reached goal
      this.playerReachedGoal = true;
    }
  }

  checkCollision(){
    for(var index=0; index< this.planetArr.length; index++){       //collide with planets
      var p = this.planetArr[index];
      if(is_collision(this.myRocket.prod, p.planet, 150)){
        this.myRocket.dead = true;
        this.GameOver = true;
      }
    }

    for(var index = 0; index < this.enemyplanes.length; index++){     //collide with enemy planes
      var e = this.enemyplanes[index];
      if(is_collision(this.myRocket.prod, e.enemy, 15)){
        this.myRocket.takeDamage(2);
        e.takeDamage(5);
                                   //simulate collision
        this.myRocket.prod.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y-50, this.myRocket.prod.position.z+150);
        e.enemy.position.set(e.enemy.position.x,e.enemy.position.y+50,e.enemy.position.z-150)
      }
    }

    for(var i = 0; i < this.healthboxes.length; i++){                    //collide with health boxes
      var healthbox = this.healthboxes[i];
      if(is_collision(healthbox, this.myRocket.prod, 30)){
        this.myRocket.refillHealth();  // replenish health
        healthbox.visible = false;
      }
    }

    for(var i = 0; i < this.objects.length; i++){                       //collide with space objects
      var spaceobject = this.objects[i];
      if(is_collision(this.myRocket.prod,spaceobject,130)){
        this.myRocket.takeDamage(3);
                                            // simulate collision
        this.myRocket.prod.position.set(this.myRocket.prod.position.x-50, this.myRocket.prod.position.y-100, this.myRocket.prod.position.z+150);
      }
    }

  }

  spawnEnemies(){  // delay to set a delay before spawning a new enemy
    if(this.delay == 1000){  // spawn new enemy
      let randomNum = Math.floor(Math.random() * (500 - 100) + 100);   // random number between
      var enemyPlane = this.spawnEnemyShip();
      enemyPlane.setMaxHealth(25);
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
        this.enemyplanes.splice(index,1);  // remove dead enemy plane from list of enemy planes
      }
    }
  }


  placePortal(){  //set portal location
    this.portal = new Portal(0);
    this.portal.rotateX(Math.PI/2);
    this.portal.scale.set(2,2,2);
    this.portal.position.set(0,0,-15000);  //set portal position if you change this remember to change other stuff
    this.scene.add(this.portal);           //                                            like healthboxes positions
  }

  RestartLevel(){    //clear the scene then reload everything
    this.scene.clear();
    this.loadIntro();
    this.delay = 0;
    this.delay2 = 0;
    this.pause = false;
    this.GameOver = false;
    this.torusreachedGoal = false;
    this.playerReachedGoal = false;
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
    directionalLight.position.set(0,10,0)
    this.scene.add( directionalLight );
    const amblight = new THREE.AmbientLight(0x404040 ,2);
    this.scene.add(amblight);
    this.scene.add(this.portal);
    this.enemyplanes = []; this.enemyplanes.length = 0;
    this.objects = []; this.objects.length = 0;
    this.planetArr = []; this.planetArr.length = 0;
    this.LoadPlayer();
    this.loadGreatLight();
    this.loadPlanets();
    this.placePortal();
    this.loadHealthBoxes();
  }

};


// window.addEventListener('DOMContentLoaded', () => {
//   const lv1 = new Level1();
// });
