import * as THREE from '../js/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialiase:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
var belt;
//controls.update() must be called after any manual changes to the camera's transform
var light = new THREE.PointLight(0xFFFFFF);
//light.position.set(0,0,15);
scene.add(light);


camera.position.set( 50, 100, 500 );
controls.update();
//camera.add(light);
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

const amblight = new THREE.AmbientLight(0x404040);
scene.add(amblight);

const planet = new THREE.Object3D();
planet.position.set(0,0,0);

scene.add(planet);
const pgeo = new THREE.SphereGeometry(100,50,50);
const pmat = new THREE.MeshLambertMaterial({color : 0x7A5224});
const planet1 = new THREE.Mesh(pgeo,pmat);

const bgeo = new THREE.SphereGeometry(3,32,32);
const bmat = new THREE.MeshPhongMaterial({color : 0xD1AE87});
const beltobj = new THREE.Mesh(bgeo,bmat);
beltobj.position.x = 102;

for (let i=0;i<30;i++){
    belt = new THREE.Mesh(bgeo,bmat);
    belt.position.x = 102*Math.cos(i*0.209);
    belt.position.z = 102*Math.sin(i*0.209);
    belt.position.y = 50*Math.sin(i*0.209);
    planet.add(belt);

}

planet.add(beltobj);

planet.add(planet1);


//scene.add(new THREE.AxesHelper(150));
var t = 0;
const animate = function () {
requestAnimationFrame( animate );
t += 0.03;
light.position.set(camera.position.x,camera.position.y,camera.position.z);

planet.rotation.z += 0.00002;
planet.rotation.x += 0.00002;
planet.rotation.y += 0.02;

renderer.render( scene, camera );
};
animate();
