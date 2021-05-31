import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {Clock} from 'https://cdn.jsdelivr.net/npm/three@0.118/src/core/Clock.js';
import {createRocket} from './spaceship.js'

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                GLOBAL DEFINITIONS AND DECLARATIONS

	var scene, camera, renderer, myRocket,clock,ring1, ring2, shooter;

	clock = new Clock();
	var keyboard = new THREEx.KeyboardState();
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,30000);
	camera.position.set(5, 10,50);
	//camera.lookAt(scene.position);
	
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);

  window.addEventListener('resize',()=>{
				renderer.setSize(window.innerWidth, window.innerHeight);
				camera.aspect=window.innerWidth/window.innerHeight;
				camera.updateProjectionMatrix();
	})

	
	let controls = new OrbitControls(camera,renderer.domElement);
	controls.enabled = false;     //disabled orbit controls
	controls.addEventListener('change', render);
	controls.minDistance = 500;
	controls.maxDistance = 1500;
	
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

myRocket = createRocket();
myRocket.position.set(0,0,0);
myRocket.scale.set(0.5,0.5,0.5);
myRocket.position.set(0,0,-9500);
ring1 = myRocket.children[6];
ring2 = myRocket.children[7];
shooter = myRocket.children[9];
scene.add( myRocket );
camera.lookAt( myRocket.position );


function update()
{
	var delta = clock.getDelta(); // seconds.
	var moveDistance = 300 * delta; // 300 pixels per second
	var rotateAngle = Math.PI / 220 //* delta;   // pi/2 radians (90 degrees) per second
	
	// local transformations

	// move forwards/backwards/left/right
	if ( !keyboard.pressed("W")   && !keyboard.pressed("S")){
		myRocket.translateY( moveDistance );
		ring1.rotation.y += 0.04;
		ring2.rotation.x += 0.08;
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
		myRocket.translateX( -moveDistance );
		myRocket.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	}
	if ( keyboard.pressed("D") ){
		myRocket.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
		myRocket.translateX(  moveDistance );	
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

	if ( keyboard.pressed("space") )  // Reset or respawn still needs fixing
	{
		shootLaser(scene,myRocket,beams);
	}
	

	//  camera to follow rocket
	var rotation_matrix = new THREE.Matrix4().identity();
	var relativeCameraOffset = new THREE.Vector3(-10,-60,-25);

	var cameraOffset = relativeCameraOffset.applyMatrix4( myRocket.matrixWorld);

	camera.position.x = cameraOffset.x;
	camera.position.y = cameraOffset.y;
	camera.position.z = cameraOffset.z;
	camera.rotateX = rotation_matrix.x;
	camera.rotateX = rotation_matrix.y;
	camera.rotateX = rotation_matrix.z;
	camera.lookAt( myRocket.position );
	
	
	//camera.updateMatrix(); 
	//myRocket.updateProjectionMatrix();
	camera.updateProjectionMatrix();
	
}

var beams = [];
//shootLaser(scene,myRocket,beams);

function updateBeam(beams){
	beams.forEach(b => {
		if (b.position.z>=20000) {
		  scene.remove(b);
		  removefrombeams(beams,b);
		}
		else{
		  b.position.z += 8;
		}
	
		});
}

function shootLaser(scene,enemy,beams){
	
	let laser1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 4), new THREE.MeshBasicMaterial({color: "cyan"}))
	laser1.position.x = enemy.position.x-0.5
	laser1.position.y = enemy.position.y
	laser1.position.z = enemy.position.z+8
   
	let laser2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 4), new THREE.MeshBasicMaterial({
	  color: "cyan"
	}));
	laser2.position.x = enemy.position.x+0.5
	laser2.position.y = enemy.position.y
	laser2.position.z = enemy.position.z+8 
	
   
	scene.add(laser1);
	scene.add(laser2);
	beams.push(laser1);
	beams.push(laser2);
}

function removefrombeams(beams,b){
	for( var i = 0; i < beams.length; i++){
   
	  if ( beams[i] === b) {
   
		  beams.splice(i, 1);
		}
   
	}
}

function render() 
{
	renderer.render( scene, camera );
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
	updateBeam(beams);
}

animate();
