import * as THREE from '../js/three.module.js';
import {controls} from './controls.js';
export {planet1}
import * as dat from '../js/dat.gui.module.js'

class planet1{
    constructor(params){
        this.createplanet(params);
    }

    createplanet(params){
        const gui = new dat.GUI();
        this.params = params;

        
        this.planet = new THREE.Object3D();

        this.pgeo = new THREE.SphereGeometry(100,50,50);
    this.pmat = new THREE.MeshLambertMaterial({color : 0x7A5224});
    this.planetobj = new THREE.Mesh(pgeo,pmat);

    this.bgeo = new THREE.SphereGeometry(3,32,32);
    this.bmat = new THREE.MeshPhongMaterial({color : 0xD1AE87});
    this.beltobj = new THREE.Mesh(bgeo,bmat);
    this.beltobj.position.x = 102;

    for (let i=0;i<30;i++){
        this.belt = new THREE.Mesh(bgeo,bmat);
        this.belt.position.x = 102*Math.cos(i*0.209);
        this.belt.position.z = 102*Math.sin(i*0.209);
        this.belt.position.y = 50*Math.sin(i*0.209);
        this.planet.add(belt);

    }

    this.planet.add(beltobj);

    this.planet.add(planetobj);

    var t = 0;
const animate = function () {
requestAnimationFrame( animate );
t += 0.03;

this.planet.rotation.z += 0.00002;
this.planet.rotation.x += 0.00002;
this.planet.rotation.y += 0.02;

renderer.render( scene, camera );
};
animate();


    }
}