import * as THREE from '../js/three.module.js';
import {controls} from './controls.js';
export {player}
import * as dat from '../js/dat.gui.module.js'

class player {
  constructor(params) {
    this.createplayer(params);
  }


  createplayer(params){
    const gui = new dat.GUI();
    this.params = params;
    this. beams = [];
    this.controller = new controls();
    this.health = 20;

    this.prod = new THREE.Object3D();
    this.aircraft = new THREE.Object3D();

    this.aircraftmaterial = new THREE.MeshLambertMaterial({color:0x171717});
    this.cpitmaterial = new THREE.MeshLambertMaterial({color:0x2674a1});
    this.ringsmaterial = new THREE.MeshLambertMaterial({color:0x00ff04});
    this.torumaterial = new THREE.MeshLambertMaterial({color:0x171717});
    this.shootmaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    this.wingmat = new THREE.MeshLambertMaterial({color:0x520703});

    this.cylgeo = new THREE.CylinderGeometry(0.5,6,40,5,1,false);
    this.cylinder = new THREE.Mesh(this.cylgeo,this.aircraftmaterial);
    this.cylinder.position.y = 15;
    this.cylinder.rotateY(Math.PI/5);
    this.aircraft.add(this.cylinder);

    this.stageo = new THREE.CylinderGeometry(5,5,1,3,5,false,0,Math.PI);
    this.stabilizer = new THREE.Mesh(this.stageo,this.aircraftmaterial);
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
    this.aircraft.add( this.wing );

    this.wing1 = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing1.scale.set(1,0.2,0.7);
    this.wing1.rotateX(-Math.PI/2);
    this.wing1.rotateZ(-Math.PI/8);
    this.wing1.position.set(5,3,2);
    this.aircraft.add( this.wing1 );

    this.wing2 = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing2.scale.set(1,0.2,0.7);
    this.wing2.rotateX(-Math.PI/2);
    this.wing2.rotateZ(Math.PI/8);
    this.wing2.rotateY(Math.PI);
    this.wing2.position.set(-5,14,2);
    this.aircraft.add( this.wing2 );

    this.wing3 = new THREE.Mesh( this.exgeo, this.wingmat ) ;
    this.wing3.scale.set(1,0.2,0.7);
    this.wing3.rotateX(-Math.PI/2);
    this.wing3.rotateZ(-Math.PI/8);
    this.wing3.rotateY(Math.PI);
    this.wing3.position.set(-5,14,-1);
    this.aircraft.add( this.wing3 );

    this.torgeo = new THREE.TorusGeometry(14,2,5,40);
    this.torus = new THREE.Mesh(this.torgeo,this.torumaterial);
    this.torus.position.y = -16;
    this.torus.rotateX(Math.PI);
    this.torus.rotateZ(-Math.PI/6);
    this.aircraft.add(this.torus);

    this.ring1geo = new THREE.TorusGeometry(9,1,3,70);
    this.ring1 = new THREE.Mesh(this.ring1geo,this.ringsmaterial);
    this.ring1.position.y = -16;
    this.aircraft.add(this.ring1);

    this.ring2geo = new THREE.TorusGeometry(5,1,3,70);
    this.ring2 = new THREE.Mesh(this.ring2geo,this.ringsmaterial);
    this.ring2.position.y = -16;
    this.aircraft.add(this.ring2);

    this.cpgeo = new THREE.SphereGeometry(5,5,30,-0.3,3.6,0,3.14);
    this.cpit = new THREE.Mesh(this.cpgeo,this.cpitmaterial);
    this.cpit.position.z = -2.5;
    this.cpit.rotateY(Math.PI);
    this.aircraft.add(this.cpit);



    this.shooter = new THREE.Object3D();

    this.splanegeo = new THREE.BoxGeometry(5,1,0.5);
    this.shplane = new THREE.Mesh(this.splanegeo,this.aircraftmaterial);
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
    this.aircraft.add(this.shooter);

    this.aircraft.rotateY(Math.PI);
    this.aircraft.rotateX(Math.PI/2);

    //reticle for the planes shooter
    this.retgeometry = new THREE.RingGeometry( 4.5, 5, 30 );
    this.retmaterial = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    this.reticle = new THREE.Mesh( this.retgeometry,this.retmaterial );
    this.reticle.position.set(0,0,-150);


    //add plane camera and reticle to one container for third person camera
    this.prod.add(this.aircraft);
    this.prod.add(this.reticle);
    params.camera.lookAt(this.reticle.position);
    this.prod.add(params.camera);
    this.params.scene.add(this.prod);


  }


  Update(delta){
    var moveDistance = 300 * delta;   // 300 pixels per second
  	var rotateAngle = Math.PI/60
    this.ring2.rotation.x += 0.1;
    this.shooter.rotation.z+=0.1;
    this.prod.position.z -=0.5
    //controls for the plane on key press using imported controlls class
    //movement for aircaft
    if (this.controller._keys.shift && this.controller._keys.left ) {
       this.aircraft.rotateOnAxis( new THREE.Vector3(0,1,0), 2*Math.PI-rotateAngle);
    }
    //if w key is pressed
    if (this.controller._keys.forward) {

        this.prod.rotation.x+=0.02;
        this.prod.rotation.x-=0.01;
		    this.ring1.rotation.y += 0.04;
		    this.ring2.rotation.x += 0.08;
        // this.params.camera.position.z-=(moveDistance*0.99)

    }
    if (this.controller._keys.backward ) {
      this.prod.rotation.x-=0.01;
      this.ring1.rotation.y -= 0.4;
      this.ring2.rotation.x -= 0.3;
      // this.params.camera.position.z+=(moveDistance*0.99);


    }

    if (this.controller._keys.left) {
      this.aircraft.rotateOnAxis( new THREE.Vector3(0,1,0),Math.PI/2);

      this.prod.position.x -= moveDistance;
      // this.params.camera.position.x-=(moveDistance*0.98);
      // this.params.camera.rotateOnAxis( new THREE.Vector3(0,0,1), -(2*Math.PI-rotateAngle));

    }
    if (this.controller._keys.right) {
      this.aircraft.rotateOnAxis( new THREE.Vector3(0,1,0), 2*Math.PI + rotateAngle);
      this.prod.position.x += moveDistance;
      // this.params.camera.position.x+=(moveDistance*0.98);
    }

    if(this.controller._keys.space){
      this.shootLaser();

    }
    if(this.controller._keys.fpc){

        this.params.camera.position.set(this.aircraft.position.x,this.aircraft.position.y+15,this.aircraft.position.z-16);

    }
    if(this.controller._keys.tpc){
      this.params.camera.position.set(this.aircraft.position.x+5,this.aircraft.position.y+30,this.aircraft.position.z +60);
        // this.params.camera.lookAt( this.enemy.position );
    }
    //buggy fix needed
    // if(this.controller._keys.rvc){
    //   this.params.camera.position.set(this.enemy.position.x,this.enemy.position.y+15,this.enemy.position.z+10);
    //   this.params.camera.lookAt( this.enemy.position.x,this.enemy.position.y+10,this.enemy.position.z+25 );
    // }
    // this.params.camera.lookAt(this.enemy)
    this.updateBeam(moveDistance);
    // this.params.camera.lookAt(this.reticle);

  }

  //cretaes a laser beam and adds it to the beams array and the world
  shootLaser(){
    let laser = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 4), new THREE.MeshLambertMaterial({color: "cyan"}));
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
      }
  }

  //players health need to implement collison check
  updateHealth(){
    if(this.health==0){
      this.enemy.visible = false;
      this.params.scene.remove(this.enemy);
    }
    else{
      this.health-=0.5;
    }
  }


};
