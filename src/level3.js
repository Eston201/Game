export{Level3}
import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import {Planet} from './planet.js';
import {Particles} from './particles.js'
import { PlanetA, PlanetBelt } from './Objects.js';
import {Portal} from './Objects.js';
import {enemy} from './enemies.js'
import {is_collision} from './is_collision.js';
import {FontLoader} from '../js/three.module.js'
import {GLTFLoader} from '../js/GLTFLoader.js';

class Level3 {
  constructor() {

    this.init();
  }

  init(){

    this.pause = false;
    this.GameOver = false;
    this.keyboard = new THREEx.KeyboardState(); // for capturing key presses
    this.FramNo=0;
    //listens for Esc to pause the game
    window.addEventListener("keydown", (e)=>{
      this.isPaused(e);
      this.changeCameraMode(e);
    }, true);
    //get the pause menu in the html file
    this.pauseMenu=document.getElementById('pauseMenu');
    this.gameOverMenu=document.getElementById('GameOverMenu');
    this.reachedGoalMenu=document.getElementById('ReachedGoalMenu');

    this.animate = true;
    this.scene = new THREE.Scene();
    this.earth;                       //our final goal
    this.torusreachedGoal = false;  //check if great light source has reached goal
    this.playerReachedGoal = false;  // check if the player has reached the goal
    this.atDeathZone = false;
    this.enemyplanes = [];
    this.delay =  0;  // delay before spawning new enemyplane
    this.delay2 = 0;  //delay before spawning incoming space object
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight,0.1, 5000);
    this.rearcamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);  // press b
    this.frontcamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);  //press v
    this.cameraMode = 0;  //third person
    this.objects = []; //objects in space except planet
    this.healthboxes = [];

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

   //Lights
   //directionalLight
   this.directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
   this.directionalLight.position.set(0,1000,0)
   this.scene.add(this.directionalLight );

   //AmbientLight
   this.amblight = new THREE.AmbientLight(0x404040 ,2);
   this.scene.add(this.amblight);

      //particles
   this.particles();
      //white flash after hyperspace
   this.whiteflash();

   this.placeEarth();  //set position of earth
   this.LoadPlayer();
   this.ThrusterSound();

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


 this.RAF();


}

  newPlanet(texture){
    const params = {
      camera: this.camera,
      scene: this.scene,
    }
    return new Planet(params,texture);

  }

  loadIntro(){
    const loader1 = new FontLoader();
    let myscene = this;
    loader1.load( '/resources/fonts/helvetiker_regular.typeface.json', function ( font ) {

        const tgeometry = new THREE.TextGeometry( 'The Great Void', {
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
        const tgeometry2 = new THREE.TextGeometry( 'Death Zone', {
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 2,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
      } );
      const tgeometry3 = new THREE.TextGeometry( 'International Space Transit', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 2,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    } );
      var mat = new THREE.MeshLambertMaterial({color:0xa4b0a0}); //  50574e
      var textmesh = new THREE.Mesh(tgeometry,mat);
      textmesh.position.set(-400,0,-400);
      var textmesh2 = new THREE.Mesh(tgeometry2,mat);
      textmesh2.position.set(-400,0,-10000);
      var textmesh3 = new THREE.Mesh(tgeometry3,mat);
      textmesh3.position.set(-600,0,-19000)
      myscene.scene.add(textmesh);
      myscene.scene.add(textmesh2);
      myscene.scene.add(textmesh3);
    } );
  }

  loadScene(){

    //kinda like a skybox but better
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
     '../resources/skybox/wrath_ft.jpg',
     '../resources/skybox/wrath_bk.jpg',
     '../resources/skybox/wrath_up.jpg',
     '../resources/skybox/wrath_dn.jpg',
     '../resources/skybox/wrath_rt.jpg',
     '../resources/skybox/wrath_lf.jpg',
   ]);
   this.scene.background = texture;
  }

  LoadPlayer(){
    const params = {
      camera: this.camera,
      scene: this.scene,
      enemyplanes: this.enemyplanes
    }
    this.myRocket = new player(params);
    this.myRocket.setLaserColor(0xdecc00)
    this.myRocket.setMaxHealth(32);
    this.rearcamera.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y+20, this.myRocket.prod.position.z-70);
    this.frontcamera.position.set(this.myRocket.prod.position.x, this.myRocket.prod.position.y, this.myRocket.prod.position.z-30);
    this.rearcamera.lookAt(this.myRocket.prod.position);
    this.myRocket.prod.add(this.rearcamera);
    this.myRocket.prod.add(this.frontcamera);
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
      if(this.animate){

        this.Update(t - this.previousFrame);
      }
      else{
        this.Updates(t - this.previousFrame);
       }
        // this.updatecamera();
       this.torus.rotateY(Math.PI/100);

        this.updateHealthBoxes();
        if(!this.pause && !this.GameOver){
            this.updateSpaceObjects();
            this.checkIfReachedGoal();
            this.checkPlayerHealth();
            this.updateGreatLight();
            this.spawnEnemies();
            this.updateEnemyPlanes();
            this.checkCollision();
                                           //check if player has reached death zone
            //this.atDeathZone = this.myRocket.prod.position.z < this.earth.planet.position.z/2;
            this.atDeathZone = this.myRocket.prod.position.z < -1000;
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

  Update(timeElapsed) {

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
      this.loadScene();
      this.loadIntro();
    }

  }

  //update the scene/ objects /player..etc
  Updates(timeElapsed) {
    if(this.pause){
      this.pauseMenu.style.visibility = "visible";
      document.body.style.cursor = 'default';
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
  if(this.FramNo==0){
    this.scene.remove(this.particle.particles);
    this.makeVisible();
    this.FramNo++;
  }

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

   //create particles an add them to the scene
   particles(){
    this.particle = new Particles({
      scene:this.scene,
      camera:this.camera
    });

  }

  //flash the screen with white plane geo
  whiteflash(){
    this.flashgeo = new THREE.PlaneBufferGeometry(2,2,1,1);
    //use a shader material to get the vertices of plane to match the viewport
    //2 2 because of clip coordinates
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

  createCylinder(timeout){
    const cyltext = new THREE.TextureLoader().load(
        'resources/textures/cylinderlevel3.jpg'
      );
    var cyl = new THREE.Mesh(new THREE.CylinderGeometry( 100, 100, 250, 32 ), new THREE.MeshBasicMaterial({map: cyltext}));
    cyl.isalive = true;
    cyl.type = 0; //type of space object to diiferentiate between space objects
    setTimeout(function(){
      cyl.isalive = false;
    }, timeout);
    this.scene.add(cyl);
    this.objects.push(cyl);
    return cyl;
  }

  createCone(timeout){
    const conetext = new THREE.TextureLoader().load(
        'resources/textures/conelevel3.jpg'
      );
    var cyl = new THREE.Mesh(new THREE.ConeGeometry( 100,250,32 ), new THREE.MeshBasicMaterial({map: conetext}));
    cyl.isalive = true;
    cyl.type = 1;  //type of space objects to diiferentiate between space objects
    setTimeout(function(){
      cyl.isalive = false;
    }, timeout);
    this.scene.add(cyl);
    this.objects.push(cyl);
    return cyl;
  }

  loadPlanets(){

    for(var z = -10000; z < 20000; z = z + 1000){
      var texture = Math.floor(Math.random() * (9 - 1) + 1);
      var x = Math.floor(Math.random() * (2500 - (-2500)) + (-2500));
      var y = Math.floor(Math.random() * (2000 - (-2000)) + (-2000));
      var planetObject = this.newPlanet(texture);
      planetObject.planet.position.set(x,y,-z);
      planetObject.addBelt();
      planetObject.planet.children[0].visible=false;
      planetObject.planet.visible=false;
      this.planetArr.push(planetObject);
     }
  }

  updateSpaceObjects(){

      if(this.delay2 == 1100){
        let randomNum = Math.floor(Math.random() * (2 - 0) + 0);
      for(var i = 0; i < 4; i++){
          if(randomNum == 2){          //cylinder
            if(this.atDeathZone){
              var cyl = this.createCylinder(40000);  // set timeout/lifetime
              cyl.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y, this.myRocket.prod.position.z-600+ (i*200));
              var cyl2 = this.createCylinder(40000);  // set timeout/lifetime
              cyl2.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y-40, this.myRocket.prod.position.z-800+ (i*200));
            }
            else{
            var cyl = this.createCylinder(40000);  // set timeout/lifetime
            cyl.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y, this.myRocket.prod.position.z-600+ (i*200));
            }
        }
          else if(randomNum >= 0){  //cone
            if(this.atDeathZone){
              var cone = this.createCone(40000);
            cone.rotateX(Math.PI/4);
            cone.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y-1000, this.myRocket.prod.position.z-1400+ (i*200));
            var cone2 = this.createCone(40000);
            cone2.rotateX(Math.PI/4);
            cone2.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y-1000, this.myRocket.prod.position.z-1600+ (i*200));
            var cone3 = this.createCone(40000);
            cone3.rotateX(Math.PI/4);
            cone3.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y-1000, this.myRocket.prod.position.z-1200+ (i*200));
            }
            else{
            var cone = this.createCone(40000);
            cone.rotateX(Math.PI/2);
            cone.position.set(this.myRocket.prod.position.x+300-(i * 300), this.myRocket.prod.position.y, this.myRocket.prod.position.z-2000+ (i*200));
          }
        }
    }

        this.delay2 = 0;
     }
     this.delay2 ++;
    for(var index = 0; index < this.objects.length; index = index+1){
        var object = this.objects[index];
        if(!object.isalive){
          this.objects.splice(index,1);
        }
        if(object.type == 0){  //cylinder
        object.rotateX(Math.PI/100);
        object.position.set(object.position.x,object.position.y,object.position.z+1.1);
        }
        else if(object.type == 1){  //cone
          if(this.atDeathZone){
            object.position.set(object.position.x,object.position.y+10,object.position.z+10);
          }
          else{
            object.position.set(object.position.x,object.position.y,object.position.z+20);
          }
          
        }
     }
  }


  loadHealthBoxes(){
    // cube to guide the player to goal
    const geometry = new THREE.BoxGeometry(50,50,50);
    const material = new THREE.MeshPhongMaterial( { color: 0x48e2f0 ,opacity: 0.6, transparent: true} );
    var healthBox1 = new THREE.Mesh( geometry, material );
    healthBox1.position.set(0,-200,-5000);
    var healthBox2 = new THREE.Mesh( geometry, material );
    healthBox2.position.set(200,200,-11000);
    var healthBox3 = new THREE.Mesh( geometry, material );
    healthBox3.position.set(200,200,-17000);
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

  makeVisible(){
    for (var i = 0; i < this.planetArr.length; i++) {
      this.planetArr[i].planet.visible=true;
      this.planetArr[i].planet.children[0].visible=true;
    }
    this.scene.add(this.GreatLight);
    this.scene.add( this.torus );
    this.scene.add( this.cone );
  }

  loadGreatLight(){   // spot light, transparent cone and spinning torus
    this.GreatLight = new THREE.SpotLight( 0xffffff, 10, 5000, Math.PI/3 );
    this.GreatLight.position.set(0,50,-100);


    const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    const material = new THREE.MeshPhongMaterial( { color: 0x6f00de , opacity: 1, transparent: true} );
    this.torus = new THREE.Mesh( geometry, material );
    this.torus.position.set(0,0,-100);

    this.GreatLight.target = this.torus;

    const coneGeometry = new THREE.ConeGeometry( 100, 10000, 50, 32 );
    const coneMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff, opacity: 0.3, transparent: true } );
    this.cone = new THREE.Mesh( coneGeometry, coneMaterial );
    this.cone.position.set(0,50,-100);

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
    if(this.myRocket.prod.position.z < (this.earth.planet.position.z-300)){  // if player missed earth, game over
      this.GameOver = true;
    }
  }

  checkIfReachedGoal(){
    if(is_collision(this.torus,this.earth.planet,3)){
        this.torusreachedGoal = true;                    //check if great light has reached goal
    }
    var distToearth = this.myRocket.prod.position.z - this.earth.planet.position.z;
    if(is_collision(this.myRocket.prod, this.earth.planet, 300)){ //check if player has reached goal
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
      if(spaceobject.type == 0 && is_collision(this.myRocket.prod,spaceobject,150)){
        this.myRocket.takeDamage(5);
                                            // simulate collision
        this.myRocket.prod.position.set(this.myRocket.prod.position.x-50, this.myRocket.prod.position.y-100, this.myRocket.prod.position.z+150);
      }
      else if(spaceobject.type == 1 && is_collision(this.myRocket.prod,spaceobject,100)){
        this.myRocket.takeDamage(5);
                                            // simulate collision
        this.myRocket.prod.position.set(this.myRocket.prod.position.x-50, this.myRocket.prod.position.y-100, this.myRocket.prod.position.z+150);
      }
    }

  }

  spawnEnemies(){  // delay to set a delay before spawning a new enemy
    if(this.delay == 900){  // spawn new enemy
      let randomNum = Math.floor(Math.random() * (500 - (-500)) + (-500));   // random number between 500 and -500
      if(randomNum < 50 && randomNum > 0){  //dont spawn too close to my rocket
        randomNum += 50;
      }
      else if(randomNum < 0 && randomNum > -50){  // dont spawn too close to my rocket
        randomNum -= 50;
      }
      var enemyPlane = this.spawnEnemyShip();
      enemyPlane.setLaserSpeed(0.9);
      enemyPlane.setLaserColor(0x0055de)
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


  placeEarth(){  //set earth location
    this.earth = this.newPlanet(0);  //earth
    this.earth.planet.scale.set(2,2,2);
    this.earth.planet.position.set(0,0,-25000);  //set earth position if you change this remember to change other stuff
    this.scene.add(this.earth.planet);           //                                            like healthboxes positions
  }

  RestartLevel(){    //clear the scene then reload everything
    this.scene.clear();
    this.loadIntro();
    this.myRocket.respawn();   // respawn 
    this.delay = 0;
    this.delay2 = 0;
    this.pause = false;
    this.GameOver = false;
    this.torusreachedGoal = false;
    this.playerReachedGoal = false;
    this.scene.add(this.directionalLight );
    this.scene.add(this.amblight);
    this.scene.add(this.earth.planet);
    this.resetGreatLightPosition();
    this.enemyplanes.splice(0,this.enemyplanes.length);  //remove all current enemy planes from list
    this.objects.splice(0,this.objects.length);          // remove all current space junk from list
    for(var i = 0; i < this.planetArr.length; i++){ // add every planet back to scene
      let p = this.planetArr[i];
      this.scene.add(p.planet);
    }
    for(var i = 0; i < this.healthboxes.length; i++){  // add all health boxes back to scene
      let healthbox = this.healthboxes[i];
      this.scene.add(healthbox);
    }
  }

  resetGreatLightPosition(){
    this.torus.position.set(0,0,this.myRocket.prod.position.z-300);
    this.GreatLight.position.set(this.torus.position.x,this.torus.position.y+100,this.torus.position.z);
    this.cone.position.set(this.torus.position.x,this.torus.position.y,this.torus.position.z);
    this.scene.add(this.torus);
    this.scene.add(this.GreatLight);
    this.scene.add(this.cone);
  }




};
