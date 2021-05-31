
import * as THREE from '../js/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {player} from './spaceship.js';
import * as dat from '../js/dat.gui.module.js';

    //debug ui
    const gui = new dat.GUI();
    const parameters = {
      color:0xff0000
    }

    let scene, camera, renderer,controls;
    init();
		function init(){
			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1, 1000);

			renderer = new THREE.WebGLRenderer({antialias:true});
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

      controls = new OrbitControls( camera, renderer.domElement );
      camera.position.set( 0, 0, 10 );
      controls.update();


			window.addEventListener('resize',()=>{
				renderer.setSize(window.innerWidth, window.innerHeight);
				camera.aspect=window.innerWidth/window.innerHeight;
				camera.updateProjectionMatrix();
			})


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
     const play = player();
     const ring1 = play.children[6];
     const ring2 = play.children[7];
     const shooter = play.children[9];
     scene.add(play);
     //dat ui for spaceship
     


     //the lasers
     var beams = [];
     lasers(scene,play,beams);


     const animate = function () {
       requestAnimationFrame( animate );
       //need a better way for this
       beams.forEach(b => {
         if (b.position.z>=40) {
           scene.remove(b);
           removefrombeams(beams,b);
         }
         else{
           b.position.z +=0.1;
         }

         });
       ring1.rotation.y += 0.04;
       ring2.rotation.x += 0.08;
       shooter.rotation.z += 0.06;
       controls.update();
       renderer.render( scene, camera );
     };

     animate();
		}


    //store the lasers on click
    function lasers(scene,enemy,beams){
      window.addEventListener("m", onMouseDown);

      function onMouseDown() {

          let laser1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 4), new THREE.MeshBasicMaterial({
            color: "cyan"
          }));
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
    }
    function removefrombeams(beams,b){
      for( var i = 0; i < beams.length; i++){

        if ( beams[i] === b) {

            beams.splice(i, 1);
          }

      }
    }
