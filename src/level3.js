import * as THREE from '../js/three.module.js';
import {player} from './spaceship.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
export{Level3}

class Level3 {
  constructor() {
    this.init();
  }

  init(){
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1500);

      this.renderer = new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.camera.position.set( 0,0,5 );
      this.controls.update()

      window.addEventListener('resize',()=>{
      this.OnWindowResize();
      },false)

      //directionalLight
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
      directionalLight.position.set(0,10,0)
      this.scene.add( directionalLight );

      //particles
      const count = 5000;
      const particlegeo = new THREE.BufferGeometry();


      const positions = new Float32Array(count*3);

      for (var i = 0; i < count*3; i++) {
        positions[i] = (Math.random()-0.5)*10;
      }

      particlegeo.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )

      const particlemat = new THREE.PointsMaterial({
        size:0.02,
        sizeAttenuation:true
      })

      const particles = new THREE.Points(particlegeo,particlemat);

      this.scene.add(particles);

      this.RAF();
  }

  OnWindowResize(){
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect=window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  RAF() {
    requestAnimationFrame((t) => {
      if (this.previousFrame === null) {
        this.previousFrame = t;
      }



      this.RAF();
      // this.Updates(t - this.previousFrame);

      this.renderer.render(this.scene, this.camera);
      this.previousFrame = t;

    });
  }

  //update the scene/ objects /player..etc
  // Updates(timeElapsed) {
  //   if(this.pause){
  //     this.pauseMenu.style.visibility = "visible";
  //
  //     return;
  // }
  // else{
  //   this.pauseMenu.style.visibility = "hidden";
  // }
  //
  //   const timeElapsedS = timeElapsed * 0.001;
  // }


};
