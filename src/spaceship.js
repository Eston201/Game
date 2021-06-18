import * as THREE from '../js/three.module.js';
import {controls} from './controls.js';
export {player}
// import * as dat from '../js/dat.gui.module.js'
import {ThirdPersonCamera} from './ThirdPersonCamera.js';
import {is_collision} from './is_collision.js';

class player {
  constructor(params) {
    this.createplayer(params);
  }


  createplayer(params){
    this.healthText = document.getElementById("healthText");
    this.healthText.style.display = "flex";
    this.healthBar = document.getElementById("health");
    this.healthBar.style.visibility = "visible";
    this.params = params;
    this.enemyplanes = this.params.enemyplanes;     // keep track of enemies
    this. beams = [];
    this.laserColor = "cyan";
    this.controller = new controls();
    this.maxHealth = 20;     //set max health player can have here
    this.dead = false; //check whether dead or alive
    this.setMaxHealth = function(maxHealth){
      this.maxHealth = maxHealth;
      this.health = this.maxHealth;
    }
    this.health = this.maxHealth;
    this.healthBar.value = this.health;
    this.healthBar.max = this.maxHealth;
    this.takeDamage = function(damage){
      this.health = this.health - damage;
      this.healthBar.value -= damage;
    }
    this.refillHealth = function(){
      this.health = this.maxHealth;
      this.healthBar.value = this.maxHealth;
    }
    this.setLaserColor = function(color){
      this.laserColor = color;
    }
    this.steerAngle = 0;
    this.steerAngleTarget = 0;

    this.prod = new THREE.Object3D();
    this.aircraft = new THREE.Object3D();
    const aircraftmaterial = new THREE.MeshLambertMaterial({color:0x171717});
    const cpitmaterial = new THREE.MeshLambertMaterial({color:0x2674a1});
    const ringsmaterial = new THREE.MeshLambertMaterial({color:0x00ff04});
    const torumaterial = new THREE.MeshLambertMaterial({color:0x171717});
    const shootmaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    const wingmat = new THREE.MeshLambertMaterial({color:0x520703});

    const cylgeo = new THREE.CylinderGeometry(0.5,6,40,5,1,false);
    const cylinder = new THREE.Mesh(cylgeo,aircraftmaterial);
    cylinder.position.y = 15;
    cylinder.rotateY(Math.PI/5);

    this.aircraft.add(cylinder);

    const stageo = new THREE.CylinderGeometry(5,5,1,3,5,false,0,Math.PI);
    const stabilizer = new THREE.Mesh(stageo,aircraftmaterial);
    stabilizer.position.z = -4;
    stabilizer.position.y = -0.6;
    stabilizer.rotateZ(Math.PI/2);
    stabilizer.rotateY(Math.PI/2);



    const length = 12, width = 0.5;

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length-5, width );
    shape.lineTo( length+5, width/2 );
    shape.lineTo(length-5,0);
    shape.lineTo( 0, 0 );

    const extrudeSettings = {
      steps: 2,
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 3,
      bevelSegments: 1
    };

    const exgeo = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    const wing0 = new THREE.Mesh( exgeo, wingmat ) ;
    wing0.scale.set(1,0.2,0.7);
    wing0.rotateX(-Math.PI/2);
    wing0.rotateZ(Math.PI/8);
    wing0.position.set(5,3,-1);
    this.aircraft.add( wing0 );

    const wing1 = new THREE.Mesh( exgeo, wingmat ) ;
    wing1.scale.set(1,0.2,0.7);
    wing1.rotateX(-Math.PI/2);
    wing1.rotateZ(-Math.PI/8);
    wing1.position.set(5,3,2);
    this.aircraft.add( wing1 );

    const wing2 = new THREE.Mesh( exgeo, wingmat ) ;
    wing2.scale.set(1,0.2,0.7);
    wing2.rotateX(-Math.PI/2);
    wing2.rotateZ(Math.PI/8);
    wing2.rotateY(Math.PI);
    wing2.position.set(-5,14,2);
    this.aircraft.add( wing2 );

    const wing3 = new THREE.Mesh( exgeo, wingmat ) ;
    wing3.scale.set(1,0.2,0.7);
    wing3.rotateX(-Math.PI/2);
    wing3.rotateZ(-Math.PI/8);
    wing3.rotateY(Math.PI);
    wing3.position.set(-5,14,-1);
    this.aircraft.add( wing3 );

    const torgeo = new THREE.TorusGeometry(14,2,5,40);
    const torus = new THREE.Mesh(torgeo,torumaterial);
    torus.position.y = -16;
    torus.rotateX(Math.PI);
    torus.rotateZ(-Math.PI/6);
    this.aircraft.add(torus);

    const ring1geo = new THREE.TorusGeometry(9,1,3,70);
    this.ring1 = new THREE.Mesh(ring1geo,ringsmaterial);
    this.ring1.position.y = -16;
    this.aircraft.add(this.ring1);

    const ring2geo = new THREE.TorusGeometry(5,1,3,70);
    this.ring2 = new THREE.Mesh(ring2geo,ringsmaterial);
    this.ring2.position.y = -16;
    this.aircraft.add(this.ring2);

    const cpgeo = new THREE.SphereGeometry(5,5,30,-0.3,3.6,0,3.14);
    const cpit = new THREE.Mesh(cpgeo,cpitmaterial);
    cpit.position.z = -2.5;
    cpit.rotateY(Math.PI);
    this.aircraft.add(cpit);



    this.shooter = new THREE.Object3D();

    const splanegeo = new THREE.BoxGeometry(5,1,0.5);
    const shplane = new THREE.Mesh(splanegeo,aircraftmaterial);
    this.shooter.add(shplane);

    const blast1geo = new THREE.CylinderGeometry(0.1,0.3,3,20,20);
    this.blaster1 = new THREE.Mesh(blast1geo,shootmaterial);
    this.blaster1.position.x = -2;
    this.blaster1.position.z = 1.65;
    this.blaster1.rotation.x = Math.PI/2;
    this.shooter.add(this.blaster1);

    const blast2geo = new THREE.CylinderGeometry(0.1,0.3,3,20,20);
    this.blaster2 = new THREE.Mesh(blast1geo,shootmaterial);
    this.blaster2.position.x = 2;
    this.blaster2.position.z = 1.65;
    this.blaster2.rotation.x = Math.PI/2;
    this.shooter.add(this.blaster2);

    this.shooter.position.y = 35;
    this.shooter.rotation.x = -Math.PI/2;
    this.aircraft.add(this.shooter);

    //third person camera to follow plane
    this.tcamera = new ThirdPersonCamera({
      camera: this.params.camera,
      target: this.prod
    });


    this.aircraft.rotateY(Math.PI);
    this.aircraft.rotateX(Math.PI/2);
    //reticle for the planes shooter
    this.retgeometry = new THREE.RingGeometry( 4.5, 5, 30 );
    this.retmaterial = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    this.reticle = new THREE.Mesh( this.retgeometry,this.retmaterial );
    //orientate the reticle to be infront of the plane
    this.reticle.rotation.x=Math.PI/2
    this.reticle.position.set(0,150,0);
    this.aircraft.add(this.reticle);



    //add plane camera and reticle to one container for third person camera
    this.prod.add(this.aircraft);

    this.params.scene.add(this.prod);

    const listener = new THREE.AudioListener();
    this.params.camera.add( listener );

    const audioLoader = new THREE.AudioLoader();

    //load laser sound
    this.LaserSound = new THREE.Audio( listener );

    audioLoader.load( '../resources/Audio/Shooter/laserSmall_000.ogg',( buffer ) =>{

        this.LaserSound.setBuffer( buffer );
        this.LaserSound.setVolume( 0.5 );
        this.LaserSound.setPlaybackRate(3)


      } );

    //load engine sound
    this.EngineSound = new THREE.Audio( listener );
    audioLoader.load( '../resources/Audio/Engine/spaceEngineLow_000.ogg',( b2 ) =>{

          this.EngineSound.setBuffer( b2 );
          this.EngineSound.setVolume( 0.5);
          this.EngineSound.setLoop(true)
          this.EngineSound.setPlaybackRate(0.3);
          //play the engine sound
          this.EngineSound.play();


      } );

  }


  Update(delta){

    var moveDistance = 150 * delta;   // 100 pixels per second
  	var rotateAngle = Math.PI/175
    //make rings  and planes shooter animate
    this.ring2.rotation.x += 0.1;
    this.ring1.rotation.y += 0.05;
    this.shooter.rotation.z+=0.1;
    //get the direction the plane is facing to make the plane move forward
    var direction = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( this.prod.quaternion ).normalize();
    //default speed when not pressing W
    this.prod.position.add(direction.multiplyScalar(0.2));


    //controls for the plane on key press using imported controlls class
    //movement for aircaft
    //if mouse left click button is pressed
    if (this.controller._keys.Lclick || this.controller._keys.space ) {   // use space or left mouse to shoot
      //fire lasers
      this.shootLaser();
      this.LaserSound.play();
    }

    //if W key is pressed
    if (this.controller._keys.forward) {
      //increase the forward speed of the aircraft look above for befault speed
        this.prod.position.add(direction.multiplyScalar(200*delta))
        this.ring1.rotation.y += 0.15;
    }

    // if A key is pressed
    if (this.controller._keys.left) {
      //set the maximum/target angle to rotate the plane
      this.steerAngleTarget = Math.PI / 2.5;
      //lerp is interploating so that we get a smooth rotation to the target angle
      this.steerAngle = THREE.MathUtils.lerp(this.steerAngle, this.steerAngleTarget, 0.1);
      //set the z rotation to this interpolated value so it slowly reaches target value
      this.prod.rotation.z = this.steerAngle
      this.prod.rotation.y+=rotateAngle;
      this.prod.position.x-=moveDistance;

    }

    // if S key is pressed
    if (this.controller._keys.backward ) {
      //reduce the speed of the aircraft..doesnt make sense to actually move an aircraft backwards
      this.prod.position.add(direction.multiplyScalar(10*delta))

    }

    // if D key is pressed
    if (this.controller._keys.right ) {
      //set the maximum/target angle to rotate the plane
      this.steerAngleTarget = -Math.PI / 2.5;
      //lerp is interploating so that we get a smooth rotation to the target angle
      this.steerAngle = THREE.MathUtils.lerp(this.steerAngle, this.steerAngleTarget, 0.1);
      //set the z rotation to this interpolated value so it slowly reaches target value
      this.prod.rotation.z = this.steerAngle
      this.prod.rotation.y-=rotateAngle;
      this.prod.position.x+=moveDistance;
    }

    if (this.controller._keys.ArrowL) {  // left arrow
      gsap.to(this.prod.rotation,{duration:1,delay:0.1,y:Math.PI/2});
      //reset the angle otherwise gsap wont work on key press again
   }

    //if E key is pressed
    if (this.controller._keys.ArrowR ) {  // right arrow
     gsap.to(this.prod.rotation,{duration:1,delay:0.1,y:-Math.PI/2});
     //reset the angle otherwise gsap wont work on key press again
   }

    //need a better barrel roll

    //if E key is pressed
    if (this.controller._keys.EKey ) {
      //uses gasap to rotate the aircraft about the y axis... this is a barrel roll!
       gsap.to(this.aircraft.rotation,{duration:1.5,delay:0.1,y:-2*Math.PI});
       //reset the angle otherwise gsap wont work on key press again
       this.aircraft.rotation.y = 0;
    }


    //if Q key is pressed
    if (this.controller._keys.QKey ) {

      //uses gasap to rotate the aircraft about the y axis... this is a barrel roll!
      gsap.to(this.aircraft.rotation,{duration:1.5,delay:0.1,y:2*Math.PI});
      //reset the angle otherwise gsap wont work on key press again
      this.aircraft.rotation.y = 0;

    }


    //still to implement
    // if(this.controller._keys.fpc){
    //
    // }
    //need a way to implement this properly with current camera setup
    // if(this.controller._keys.tpc){
    //   this.params.camera.position.set(this.aircraft.position.x+5,this.aircraft.position.y+30,this.aircraft.position.z +60);
    //     // this.params.camera.lookAt( this.enemy.position );
    // }
    //buggy fix needed
    // if(this.controller._keys.rvc){
    //   this.params.camera.position.set(this.enemy.position.x,this.enemy.position.y+15,this.enemy.position.z+10);
    //   this.params.camera.lookAt( this.enemy.position.x,this.enemy.position.y+10,this.enemy.position.z+25 );
    // }

    //if space bar is pressed make plane go up // this.controller._keys.space ||
    if(( this.controller._keys.ArrowU ) && (!this.controller._keys.shift || !this.controller._keys.ArrowD) ){

      // rotate plane up
      gsap.to(this.aircraft.rotation,{duration:0.8,delay:0,x:2});
      //increase vertical position
      direction.y += 70 * delta;
      this.prod.position.y+=direction.y;

    }



    if((this.controller._keys.shift || this.controller._keys.ArrowD) && (!this.controller._keys.space || !this.controller._keys.ArrowU)){
      // rotate plane down
      gsap.to(this.aircraft.rotation,{duration:0.8,delay:0,x:0});
      //decrease vertical position
      direction.y -= 100 * delta;
      this.prod.position.add(direction)
    }

    //put plane back into orignal rotation state if we are not moving up or down
    //DO NOT CHANGE
    if(!this.controller._keys.ArrowU ){ // !this.controller._keys.space &&
      gsap.to(this.aircraft.rotation,{duration:0.8,delay:0,x:1.5});
    }


    //if we are not pressing a or d then tilt the plane slowly back to its positon
    if(!this.controller._keys.left || !this.controller._keys.right ){
      this.steerAngleTarget = 0;
      this.steerAngle = THREE.MathUtils.lerp(this.steerAngle, this.steerAngleTarget, 0.1);
      this.prod.rotation.z = this.steerAngle
    }



    this.updateBeam(moveDistance);//update beams position in world
    this.tcamera.Update(delta);//update the camera to follow plane
    this.updateHealth();
    //this.healthBar.value = (this.health/this.maxHealth)*100

  }

  //creates a laser beam and adds it to the beams array and the world
  shootLaser(){
    let laser = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), new THREE.MeshLambertMaterial({color: this.laserColor}));
    //used to remove  laser from the scene and from the beams array
    laser.isalive=true;
    //get the planes shooter world position  on every shot
  	const shooterWorldPosition = new THREE.Vector3();
    this.shooter.getWorldPosition(shooterWorldPosition);
    //copy the above position into the new bullet positon i.e start bullet at shooters tip
    laser.position.copy(shooterWorldPosition);

    //get the reticle position for this plane
    const reticle = new THREE.Vector3();
    this.reticle.getWorldPosition(reticle)

    //get the dirction between the planes shooter and reticle to determine where the bullet will travel
    var dir = new THREE.Vector3();
    //normalize it and negate(negate to orientate the dirction in the shooters dir)
    //multiply by a scalar for lasers speed
    dir.subVectors( shooterWorldPosition, reticle).negate().multiplyScalar(0.1);
    //add the dirction as the velocity of the bullet so that we can translate it later
    laser.velocity = dir;
    //sets a timer to set this particular bullet isalive to false
    setTimeout(function(){
			laser.isalive = false;
		}, 1000);
    //add the lasers to the scene and store them in an array for later ref
    this.params.scene.add(laser);
  	this.beams.push(laser);
   }

   //loop through the beams array to update beams position or remove any beams
   updateBeam(moveDistance){
    var size = this.beams.length;

    for(var index = 0; index < size; index = index + 1){
        var beam  = this.beams[index];
        //if there is no "beam at this position skip"
        if( this.beams[index] === undefined ){
          continue;
        }
        //if there is and its isalive is false remove beam from scene and array
        if(beam.isalive==false){
            this.params.scene.remove(beam);
            this.beams.splice(index,1);
            continue;
        }
        //if there is a beam and its still alive translate it
         beam.position.add(beam.velocity);
         for( var i = 0; i < this.enemyplanes.length; i = i + 1){
           //console.log(this.enemyplanes.length);
           var enemy = this.enemyplanes[i];
           if(is_collision(beam,enemy.enemy,25)){
             enemy.takeDamage(1);
             this.params.scene.remove(beam);
             this.beams.splice(index,1);
           }
         }
    }
}

  updateHealth(){
    if(this.health<=0){
      //console.log(this.health);
      this.dead = true;
      this.prod.visible = false;
      this.params.scene.remove(this.prod);
    }
  }


};
