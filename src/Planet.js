import * as THREE from '../js/three.module.js';
export {Planet}
import * as dat from '../js/dat.gui.module.js'

class Planet {

  constructor(params,pval) {
    this.createPlanet(params,pval);
  }

  createPlanet(params, pval){
    this.params = params;
    this.planet = new THREE.Object3D();

    const earthtext = new THREE.TextureLoader().load(
      'resources/textures/earth.jpeg'
    );
  const marstext = new THREE.TextureLoader().load(
      'resources/textures/spacerock.jpg'
    );
  const magmatext = new THREE.TextureLoader().load(
      'resources/textures/magma.jpg'
    );
  const bluetext = new THREE.TextureLoader().load(
      'resources/textures/blue.jpg'
    );
  const tarr = [earthtext,
      marstext,
      magmatext,
      bluetext
  ];

  const pgeo = new THREE.SphereGeometry(150,80,80);
  const pmat = new THREE.MeshBasicMaterial({map : tarr[pval]});
  const planetobj = new THREE.Mesh(pgeo,pmat);

    this.planet.add(planetobj);
    this.params.scene.add(this.planet);

  }

  addBelt(){
    const gravplanet = new THREE.Object3D();

    const asttext = new THREE.TextureLoader().load(
        'resources/textures/spacerock.jpg'
    );
    
    const bgeo = new THREE.SphereGeometry(3,32,32);
    const bmat = new THREE.MeshLambertMaterial({map : asttext});
    

    const rotval = (1/50)*2*Math.PI;
    for (let i=0;i<50;i++){
        const belt = new THREE.Mesh(bgeo,bmat);
         belt.position.x = 162*Math.cos(i*rotval);
         belt.position.z = 162*Math.sin(i*rotval);
         belt.position.y = 30*Math.sin(i*rotval);
         gravplanet.add(belt);

    }

    gravplanet.position.copy(this.planet.position);
    this.planet.add(gravplanet);
    this.params.scene.add(gravplanet);
  }

  animate(){
    this.planet.rotation.z += 0.00002;
    this.planet.rotation.x += 0.00002;
    this.planet.rotation.y += 0.02;

  }

};
