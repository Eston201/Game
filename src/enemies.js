import * as THREE from '../js/three.module.js';
import {controls} from './controls.js';
import * as dat from '../js/dat.gui.module.js';
import {is_collision} from './is_collision.js';

export {enemy}
class enemy {
  constructor(params) {
    this.createplayer(params);
  }


  createplayer(params){
    const gui = new dat.GUI();
    this.params = params;
    this.beams = [];
    this.controller = new controls();
    this.health = 20;
    this.takeDamage = function(damage){
      this.health = this.health - damage;
    }
    this.variant = Math.floor(Math.random() * (4 - 1) + 1);   // random number between 3 and 1 to determine which hunt variant to use
    console.log("variant: ", this.variant);
    this.dead = false;
    this.enemy = new THREE.Object3D();
    this.target = this.params.target.prod;
    this.btte = new THREE.TextureLoader().load(
      './resources/textures/blackstripes.jpg'
    );
    this.enemymaterial = new THREE.MeshLambertMaterial({map: this.btte});
    this.cpitmaterial = new THREE.MeshLambertMaterial({color:0x2674a1});
    this.ringsmaterial = new THREE.MeshLambertMaterial({color:0x220000});
    this.torumaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    this.shootmaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    this.wingmat = new THREE.MeshLambertMaterial({color:0x3B3D3D});

    this.cylgeo = new THREE.CylinderGeometry(0.5,6,40,5,1,false);
    this.cylinder = new THREE.Mesh(this.cylgeo,this.enemymaterial);
    this.cylinder.position.y = 15;
    this.cylinder.rotateY(Math.PI/5);
    this.enemy.add(this.cylinder);

    this.stageo = new THREE.CylinderGeometry(5,5,1,3,5,false,0,Math.PI);
    this.stabilizer = new THREE.Mesh(this.stageo,this.enemymaterial);
    this.stabilizer.position.z = -4;
    this.stabilizer.position.y = -0.6;
    this.stabilizer.rotateZ(Math.PI/2);
    this.stabilizer.rotateY(Math.PI/2);


    //enemy.add(stabilizer);
    //
    // wings

    const length = 12, width = 0.5;

    this.shape = new THREE.Shape();
    this.shape.moveTo( 0,0 );
    this.shape.lineTo( 0, width );
    this.shape.lineTo( length-5, width );
    this.shape.lineTo( length+5, width/2 );
    this.shape.lineTo(length-5,0);
    this.shape.lineTo( 0, 0 );

    this.extrudeSettings = {
      steps: 2,
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 3,
      bevelSegments: 1
    };

    this.exgeo = new THREE.ExtrudeGeometry( this.shape, this.extrudeSettings );

    this.wing = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing.scale.set(1,0.2,0.7);
    this.wing.rotateX(-Math.PI/2);
    this.wing.rotateZ(Math.PI/8);
    this.wing.position.set(5,3,-1);
    this.enemy.add( this.wing );

    this.wing1 = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing1.scale.set(1,0.2,0.7);
    this.wing1.rotateX(-Math.PI/2);
    this.wing1.rotateZ(-Math.PI/8);
    this.wing1.position.set(5,3,2);
    this.enemy.add( this.wing1 );

    this.wing2 = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing2.scale.set(1,0.2,0.7);
    this.wing2.rotateX(-Math.PI/2);
    this.wing2.rotateZ(Math.PI/8);
    this.wing2.rotateY(Math.PI);
    this.wing2.position.set(-5,14,2);
    this.enemy.add( this.wing2 );

    this.wing3 = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing3.scale.set(1,0.2,0.7);
    this.wing3.rotateX(-Math.PI/2);
    this.wing3.rotateZ(-Math.PI/8);
    this.wing3.rotateY(Math.PI);
    this.wing3.position.set(-5,14,-1);
    this.enemy.add( this.wing3 );

    this.torgeo = new THREE.TorusGeometry(14,2,5,40);
    this.torus = new THREE.Mesh(this.torgeo,this.torumaterial);
    this.torus.position.y = -16;
    this.torus.rotateX(Math.PI);
    this.torus.rotateZ(-Math.PI/6);
    this.enemy.add(this.torus);

    this.ring1geo = new THREE.TorusGeometry(9,1,3,70);
    this.ring1 = new THREE.Mesh(this.ring1geo,this.ringsmaterial);
    this.ring1.position.y = -16;
    this.enemy.add(this.ring1);

    this.ring2geo = new THREE.TorusGeometry(5,1,3,70);
    this.ring2 = new THREE.Mesh(this.ring2geo,this.ringsmaterial);
    this.ring2.position.y = -16;
    this.enemy.add(this.ring2);

    this.cpgeo = new THREE.SphereGeometry(5,5,30,-0.3,3.6,0,3.14);
    this.cpit = new THREE.Mesh(this.cpgeo,this.cpitmaterial);
    this.cpit.position.z = -2.5;
    this.cpit.rotateY(Math.PI);
    this.enemy.add(this.cpit);



    this.shooter = new THREE.Object3D();

    this.splanegeo = new THREE.BoxGeometry(5,1,0.5);
    this.shplane = new THREE.Mesh(this.splanegeo,this.enemymaterial);
    this.shooter.add(this.shplane);

    this.blast1geo = new THREE.CylinderGeometry(0.1,0.3,3,20,20);
    this.blaster1 = new THREE.Mesh(this.blast1geo,this.shootmaterial);
    this.blaster1.position.x = -2;
    this.blaster1.position.z = 1.65;
    this.blaster1.rotation.x = Math.PI/2;
    this.shooter.add(this.blaster1);

    this.blast2geo = new THREE.CylinderGeometry(0.1,0.3,3,20,20);
    this.blaster2 = new THREE.Mesh(this.blast1geo,this.shootmaterial);
    this.blaster2.position.x = 2;
    this.blaster2.position.z = 1.65;
    this.blaster2.rotation.x = Math.PI/2;
    this.shooter.add(this.blaster2);

    this.shooter.position.y = 35;
    this.shooter.rotation.x = -Math.PI/2;
    this.enemy.add(this.shooter);

    this.enemy.rotateY(Math.PI);
    this.enemy.rotateX(Math.PI/2);

    this.params.scene.add(this.enemy)

  }

  //movement for aircaft
  Update(delta){
    if(!this.dead){
      //console.log(this.health);
    var moveDistance = 200 * delta;   // 300 pixels per second
    this.huntShip(moveDistance);
    }
    this.updatebeams(moveDistance);
    this.updateHealth();
  }

  shootLaser(){
          // if i select '5' at random between 1-100 then shoot
    let randomNum = Math.floor((Math.random() * 100) + 1);   // to decrease frequency of shots
		if(randomNum == 5){
			var enemy_shooterWorldPosition = new THREE.Vector3(0,0,0);
			//let laser = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), new THREE.MeshLambertMaterial({color: "yellow"}));
      let laser = new THREE.Mesh( new THREE.ConeGeometry( 3, 10, 32 ) ,  new THREE.MeshLambertMaterial( {color: 0x9934eb} ) );
			laser.position.copy(this.shooter.getWorldPosition(enemy_shooterWorldPosition));
      //laser.lookAt(this.target.position);
      //laser.rotateX(Math.PI/2);
			//laser.quaternion.copy(this.params.camera.quaternion);
         
      laser.isalive=true;   //used to remove  laser from the scene and from the beams array
       
      setTimeout(function(){   //sets a timer to set this particular bullet isalive to false
        laser.isalive = false;
      }, 5000);
			this.params.scene.add(laser);
			this.beams.push(laser);
		}

    /*
    let laser1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 4), new THREE.MeshLambertMaterial({color: "cyan"}));
  	var shooterWorldPosition = new THREE.Vector3(0,0,0);
  	laser1.position.copy(this.shooter.getWorldPosition());
  	laser1.quaternion.copy(this.params.camera.quaternion);

  	this.params.scene.add(laser1);
  	this.beams.push(laser1);
    */
   }

   updatebeams(moveDistance){
     var size = this.beams.length;
	   for(var index = 0; index < size; index+=1){

      var beam  = this.beams[index];
      //if there is no "beam at this position skip"
      if( this.beams[index] === undefined ){
        continue;
      }
      //if there is and its isalive is false remove beam from scene and array
      if(beam.isalive==false){
          beam.visible = false;
          this.params.scene.remove(beam);
          this.beams.splice(index,1);
          size = this.beams.length;
          continue;
      }

		  var target = this.target.position.clone();
		  var directionVector = target.sub(beam.position.clone()).normalize();
		  beam.lookAt(this.target.position);
      beam.rotateX(Math.PI/2);
		  beam.translateOnAxis(directionVector,moveDistance*0.6);

		  if(is_collision(beam,this.target,6)){
              this.params.target.takeDamage(1);  //specify damage
              //console.log("player hit")
			        beam.visible = false;
		         this.beams.splice(index,1);
			       size = this.beams.length;
		    }
	    }
   }


  updateHealth(){
    if(this.health==0){
      this.enemy.visible = false;
      this.dead = true;
      this.params.scene.remove(this.enemy);
    }
  }
  huntShip(moveDistance){ // enemy plane is given a random hunt variant to simulate non-repetitive multi-agent behaviour
    if(this.variant == 1){
      this.huntShipVariant1(moveDistance);
    }
    if(this.variant == 2){
      this.huntShipVariant2(moveDistance);
    }
    else{
      this.huntShipVariant3(moveDistance);
    }
  }
  huntShipVariant1(moveDistance){
	    var dx = this.target.position.x - this.enemy.position.x;
	    var dy = this.target.position.y - this.enemy.position.y;
	    var dz = this.target.position.z - this.enemy.position.z;
        //console.log(dx,dy,dz);
	    //var vector_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
	    var forward_speed = 1.9,  vertical_speed = 0.5, horizontal_speed = 0.9;

        if(dy == 0 || dy == 100){ // if one the same y plane
            //if(dx != 0){             // look at target
            // this.enemy.lookAt(this.target.position)
           // this.enemy.rotateX(Math.PI/2);
           // }
            
            this.enemy.quaternion.copy(this.target.quaternion);
            this.enemy.rotateY(Math.PI);
            this.enemy.rotateX(Math.PI/2);
       }

      
        if(dz < 0){ //my rocket is ahead of enemy
            this.enemy.position.z += Math.max( -forward_speed, dz);  // go forward
        }
        if(dz > 100){ //my rocket is more than 100 units behind the enemy
            this.enemy.position.z += Math.min( forward_speed, dz);
        }
        if(dy < 0){  // my rocket (target) is below
            this.enemy.rotateX(this.target.rotation.x);
            this.enemy.position.y += Math.max(-vertical_speed, dy);
        }
        if(dy > 0){  // my rocket (target) is above
            this.enemy.rotateX(this.target.rotation.x);
            this.enemy.position.y += Math.min( vertical_speed, dy);  
        }
        if(Math.abs(dx) > 400){   // keep a certain distance from target
          if(dx < 0){ // if my rocket (target) is leftwards
              this.enemy.position.x += Math.max( -horizontal_speed, dx);
          }
          if(dx > 0){ //my rocket is rightwards
              this.enemy.position.x += Math.min( horizontal_speed, dx);
          }
      }
      else{   // if target is close
          this.shootLaser();
      }
        
        //directionVector = new THREE.Vector3(dx,dy,dz).normalize();
        //this.enemy.lookAt(this.target.position);
        //this.enemy.translateOnAxis(directionVector, moveDistance*speed);
        //console.log(this.enemy.position.x, this.enemy.position.y, this.enemy.position.z)
        //this.enemy.position.set(this.target.position.x, this.target.position.y,this.target.position.z);

	} 

  huntShipVariant2(moveDistance){
    var dx = this.target.position.x - this.enemy.position.x;
    var dy = this.target.position.y - this.enemy.position.y;
    var dz = this.target.position.z - this.enemy.position.z;
      //console.log(dx,dy,dz);
    //var vector_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    var forward_speed = 1.4,  vertical_speed = 0.6, horizontal_speed = 0.5;

    if(dy == 0 || dy == 100){ // if one the same y plane
       if(dx != 0){             // look at target
       this.enemy.lookAt(this.target.position)
      this.enemy.rotateX(Math.PI/2);
      }
      
      //this.enemy.quaternion.copy(this.target.quaternion);
      //this.enemy.rotateY(Math.PI);
      //this.enemy.rotateX(Math.PI/2);
    }


      if(dz < 0){ //my rocket is ahead of enemy
          this.enemy.position.z += Math.max( -forward_speed, dz);  // go forward
      }
      if(dz > 100){ //my rocket is more than 100 units behind the enemy
          this.enemy.position.z += Math.min( forward_speed, dz);
      }
      if(dy < 0){  // my rocket (target) is below
          this.enemy.rotateX(this.target.rotation.x);
          this.enemy.position.y += Math.max(-vertical_speed, dy);
      }
      if(dy > 0){  // my rocket (target) is above
          this.enemy.rotateX(this.target.rotation.x);
          this.enemy.position.y += Math.min( vertical_speed, dy);  
      }
      if(Math.abs(dx) > 400){   // keep a certain distance from target
        if(dx < 0){ // if my rocket (target) is leftwards
            this.enemy.position.x += Math.max( -horizontal_speed, dx);
        }
        if(dx > 0){ //my rocket is rightwards
            this.enemy.position.x += Math.min( horizontal_speed, dx);
        }
    }
    else{   // if target is close
        this.shootLaser();
    }

}

huntShipVariant3(moveDistance){
  var dx = this.target.position.x - this.enemy.position.x;
  var dy = this.target.position.y - this.enemy.position.y;
  var dz = this.target.position.z - this.enemy.position.z;
    //console.log(dx,dy,dz);
  //var vector_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  var forward_speed = 0.7,  vertical_speed = 0.8, horizontal_speed = 1.4;

  if(dy == 0 || dy == 100){ // if one the same y plane
    if(dx != 0){             // look at target
    this.enemy.lookAt(this.target.position)
    this.enemy.rotateX(Math.PI/2);
    }
    
    //this.enemy.quaternion.copy(this.target.quaternion);
    //this.enemy.rotateY(Math.PI);
    //this.enemy.rotateX(Math.PI/2);
  }


    if(dz < 0){ //my rocket is ahead of enemy
        this.enemy.position.z += Math.max( -forward_speed, dz);  // go forward
    }
    if(dz > 100){ //my rocket is more than 100 units behind the enemy
        this.enemy.position.z += Math.min( forward_speed, dz);
    }
    if(dy < 0){  // my rocket (target) is below
        this.enemy.rotateX(this.target.rotation.x);
        this.enemy.position.y += Math.max(-vertical_speed, dy);
    }
    if(dy > 0){  // my rocket (target) is above
        this.enemy.rotateX(this.target.rotation.x);
        this.enemy.position.y += Math.min( vertical_speed, dy);  
    }
    if(Math.abs(dx) > 400){   // keep a certain distance from target
      if(dx < 0){ // if my rocket (target) is leftwards
          this.enemy.position.x += Math.max( -horizontal_speed, dx);
      }
      if(dx > 0){ //my rocket is rightwards
          this.enemy.position.x += Math.min( horizontal_speed, dx);
      }
    }
    else{   // if target is close
      this.shootLaser();
    }
        

}

};
