
import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import {createPlanet} from './planet.js';
import * as dat from '../js/dat.gui.module.js';
import {is_collision} from './collision.js';
import {collides} from './collision.js';
    //debug ui
    const gui = new dat.GUI();
    const parameters = {
      color:0xff0000
    }

	var scene, camera, renderer,myRocket,ring1, ring2, shooter,clock, enemy, enemy_ring1, enemy_ring2, enemy_shooter;
    var beams = [], enemy_beams = [], player_health = 20, enemy_health = 20, delay = 0;
    var keyboard = new THREEx.KeyboardState();
    clock = new THREE.Clock();
    init();
    animate()
		function init(){
			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 30000);

			renderer = new THREE.WebGLRenderer({antialias:true});
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);
      			camera.position.set( 5, 30, 60 );


			window.addEventListener('resize',()=>{
				renderer.setSize(window.innerWidth, window.innerHeight);
				camera.aspect=window.innerWidth/window.innerHeight;
				camera.updateProjectionMatrix();
			})

			let controls = new OrbitControls(camera,renderer.domElement);
			controls.enabled = false;
			controls.addEventListener('change', render);
			controls.minDistance = 500;
			controls.maxDistance = 1500;

	
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial( { color: parameters.color } );
      const cube = new THREE.Mesh( geometry, material );
      cube.position.set(10,0,0);
      scene.add( cube );
      //testing dat GUI
      gui
      .add(cube.position,'y')
      .min(-3)
      .max(3)
      .step(0.01);

      gui
      .addColor(parameters,'color')
      .onChange(()=>
        material.color.set(parameters.color)
      )

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
     scene.background = texture;

     //directionalLight
     const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
     directionalLight.position.set(0,10,0)
     scene.add( directionalLight );
     //AmbientLight
     const amblight = new THREE.AmbientLight(0x404040 ,2);
     scene.add(amblight);

     //player spaceship
     myRocket = player();
     ring1 = myRocket.children[6];
     ring2 = myRocket.children[7];
     shooter = myRocket.children[9];
	 myRocket.rotateZ(Math.PI);
     scene.add(myRocket);
     //dat ui for spaceship
	 spawnEnemyShip()

    }	
	//store the lasers on click
    function shootLaser(scene,enemy,beams){
	let laser1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 4), new THREE.MeshLambertMaterial({color: "cyan"}));
	var shooterWorldPosition = new THREE.Vector3(0,0,0);
	laser1.position.copy(shooter.getWorldPosition(shooterWorldPosition));
	laser1.quaternion.copy(camera.quaternion);
   
	scene.add(laser1);
	//scene.add(laser2);
	beams.push(laser1);
	//beams.push(laser2);
   }

	function removefrombeams(beams,b){
      for( var i = 0; i < beams.length; i++){

        if ( beams[i] === b) {

            beams.splice(i, 1);
          }

      }
    }

    function update(){

	if(enemy_health == 0){
		enemy.visible = false;
		scene.remove(enemy);
	}
	else if(player_health == 0){
		myRocket.visible = false;
		scene.remove(myRocket);
	}
	

	var delta = clock.getDelta(); // seconds.
	var moveDistance = 300 * delta; // 300 pixels per second
	var rotateAngle = Math.PI / 220 //* delta;   // pi/2 radians (90 degrees) per second

	// local transformations

	// move forwards/backwards/left/right
	if ( !keyboard.pressed("W")   && !keyboard.pressed("S")){
		myRocket.translateY( moveDistance );
		camera.translateZ(-moveDistance*0.98);
		ring1.rotation.y += 0.04;
		ring2.rotation.x += 0.08;
		enemy_shooter.rotation.z = 0.04;
	}
	if ( keyboard.pressed("S") ){
		myRocket.translateY(  -moveDistance );
		ring1.rotation.y += 0.04;
		ring2.rotation.x += 0.08;
	}
	if ( keyboard.pressed("Q") )
		myRocket.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		myRocket.translateX(  moveDistance );

	// rotate left/right/up/down

	if ( keyboard.pressed("A")) {
		//myRocket.translateX( -moveDistance );
		myRocket.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	}
	if ( keyboard.pressed("D") ){
		myRocket.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
		//myRocket.translateX(  moveDistance );
	}
	if ( keyboard.pressed("up") ){
		myRocket.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	}
	if ( keyboard.pressed("down") ) {
		myRocket.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	}
	if ( keyboard.pressed("right") ) {
		myRocket.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
		myRocket.updateMatrix();
	}
	if ( keyboard.pressed("left") ) {
		myRocket.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);
	}

	if ( keyboard.pressed("Z") )  // Reset or respawn still needs fixing
	{
		//myRocket.position.set(0,0,0);
		myRocket.position.set(0,0,-5000);
		//myRocket.rotation.set(0,0,0);
	}

	if ( keyboard.pressed("space") )  
	{
		shootLaser(scene,myRocket,beams);
	}
	//  camera to follow rocket
	camera.lookAt( myRocket.position );
	updateBeam(beams, moveDistance);

	//camera.updateMatrix();
	//myRocket.updateProjectionMatrix();
	//camera.updateProjectionMatrix();
	enemy_ring1.rotation.y += 0.04;
	enemy_ring2.rotation.x += 0.08;
	enemy_shooter.rotation.z = 0.04;
	huntShip(enemy,enemy_shooter, myRocket,moveDistance);
}
  
function updateBeam(beams, moveDistance){
	var size = beams.length;
	for(var index = 0; index < size; index = index + 1){
		var beam  = beams[index];
		beam.translateZ(-(moveDistance+1.5) ); 

		if(is_collision(beam, enemy, 4.5)){
		console.log("beans: ", player_health);
		enemy_health  = enemy_health - 0.5;
		enemy_beams.splice(index,1);
		size = beams.length;
		}
		
	}
}


function updateEnemyBeam(enemy_beams, moveDistance){
	var size = enemy_beams.length;
	for(var index = 0; index < size; index = index + 1){
		var beam  = enemy_beams[index];
		
		var target = myRocket.position.clone();
		var directionVector = target.sub(beam.position.clone()).normalize();
		beam.lookAt(directionVector);
		beam.translateOnAxis(directionVector,moveDistance*0.6);
		if(collides(beam,myRocket,3)){
			player_health  = player_health - 0.5;
			beam.visible = false;
			enemy_beams.splice(index,1);
			size = enemy_beams.length;
		}
	}
}

function huntShip(enemy, enemy_shooter, myRocket, moveDistance){
	var dx = myRocket.position.x - enemy.position.x;
	var dy = myRocket.position.y - enemy.position.y;
	var dz = myRocket.position.z - enemy.position.z;
	var vector_distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
	var speed = 1; var directionVector;

	if(vector_distance > 100){
		speed = 1.3;
		directionVector = new THREE.Vector3(dx,dy,dz).normalize();
		enemy.lookAt(directionVector);
		enemy.translateOnAxis(directionVector,moveDistance*speed);
	}
	else{
		dz = myRocket.position.z - 100 - enemy.position.z;     //set fake position
		directionVector = new THREE.Vector3(dx,dy,dz).normalize();
		enemy.lookAt(directionVector);
		enemy.translateOnAxis(directionVector,moveDistance*speed);

		let randomNum = Math.floor((Math.random() * 100) + 1);
		if(randomNum == 5){
			var enemy_shooterWorldPosition = new THREE.Vector3(0,0,0);
			let laser = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 4), new THREE.MeshLambertMaterial({color: "yellow"}));
			laser.position.copy(enemy_shooter.getWorldPosition(enemy_shooterWorldPosition));
			//laser1.quaternion.copy(camera.quaternion);
			scene.add(laser);
			enemy_beams.push(laser);
		}
		updateEnemyBeam(enemy_beams,moveDistance);
	}

	
	enemy.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2);

}

function spawnEnemyShip(){
	 enemy = player();
	 enemy.position.set(myRocket.position.x-10, myRocket.position.y, myRocket.position.z-50);
	 enemy_ring1 = enemy.children[6];
     enemy_ring2 = enemy.children[7];
	 enemy_shooter = enemy.children[9];
	 scene.add(enemy);
}

function animate() {
  requestAnimationFrame( animate );
  	
	renderer.render(scene,camera);
	update();
}

function render(){
	renderer.render(scene,camera);
}


