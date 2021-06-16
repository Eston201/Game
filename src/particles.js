import * as THREE from '../js/three.module.js';
export {Particles}
class Particles {
  constructor(params) {
    this.init(params);
  }

  init(params){
    this.params = params;
    // const textureLoader = new THREE.TextureLoader();
    // const particletexture = textureLoader.load('./resources/particles/light_02.png')
    //particles
    this.count = 50000;
    //put particles in a buffer geo
    this.particlegeo = new THREE.BufferGeometry();
    //stores the positions of the particles
    const positions = new Float32Array(this.count*3);
    //sets the positions of the particles randomly
    for (var i = 0; i < this.count*3; i++) {
      if(i%3==0 || i==0){
        //make it spread out in the -Z direction
        positions[i] = (Math.random())*10000;
      }
      else{
        positions[i] = (Math.random()-0.5)*1000;
      }

    }
    //add the positions into the buffer geo
    this.particlegeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    //particle material
    const particlemat = new THREE.PointsMaterial({
      size:2,
      sizeAttenuation:true,
      color: 'white'

    });

    //create the particles using buffer geo and particle material
    this.particles = new THREE.Points(this.particlegeo,particlemat);
    //rotate the particles for positioning infront of player
    this.particles.rotation.y = Math.PI/2;
    params.scene.add(this.particles);

    this.frameNo=1;
  }


  update(delta){
    this.frameNo++;
    if(this.particles.position.z<10000){
      this.particles.position.z+=(this.frameNo*5)*delta;
    }

    else{
      this.params.scene.remove(this.particles);

    }


  }
}
