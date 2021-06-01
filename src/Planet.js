import * as THREE from '../js/three.module.js';
export {planet}
import * as dat from '../js/dat.gui.module.js'

class planet {

  constructor(params) {
    this.createPlanet(params);
  }

  createPlanet(params){
    this.planet = new THREE.Object3D();

    this.pgeo = new THREE.SphereGeometry(100,50,50);
    this.pmat = new THREE.MeshLambertMaterial({color : 0x2B7BEA});
    this.planetobj = new THREE.Mesh(this.pgeo,this.pmat);

    this.bgeo = new THREE.SphereGeometry(3,32,32);
    this.bmat = new THREE.MeshPhongMaterial({color : 0xD1AE87});
    this.beltobj = new THREE.Mesh(this.bgeo,this.bmat);
    this.beltobj.position.x = 102;

    for (let i=0;i<30;i++){
        this.belt = new THREE.Mesh(this.bgeo,this.bmat);
        this.belt.position.x = 102*Math.cos(i*0.209);
        this.belt.position.z = 102*Math.sin(i*0.209);
        this.belt.position.y = 50*Math.sin(i*0.209);
        this.planet.add(this.belt);

    }

    this.planet.add(this.beltobj);

    this.planet.add(this.planetobj);
  

  }
  animate(){
    this.planet.rotation.z += 0.00002;
    this.planet.rotation.x += 0.00002;
    this.planet.rotation.y += 0.02;
  }

};
