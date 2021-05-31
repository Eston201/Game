import * as THREE from '../js/three.module.js';
export {player}

function player(){
  var enemy = new THREE.Object3D();
  //const enemycolor = new THREE.color(0xe5e5e5);
  const enemymaterial = new THREE.MeshLambertMaterial({color:0x171717});
  const cpitmaterial = new THREE.MeshLambertMaterial({color:0x2674a1});
  const ringsmaterial = new THREE.MeshLambertMaterial({color:0x00ff04});
  const torumaterial = new THREE.MeshLambertMaterial({color:0x171717});
  const shootmaterial = new THREE.MeshLambertMaterial({color:0xffffff});
  const wingmat = new THREE.MeshLambertMaterial({color:0x520703});

  const cylgeo = new THREE.CylinderGeometry(0.5,6,40,5,1,false);
  const cylinder = new THREE.Mesh(cylgeo,enemymaterial);
  cylinder.position.y = 15;
  cylinder.rotateY(Math.PI/5);
  enemy.add(cylinder);

  const stageo = new THREE.CylinderGeometry(5,5,1,3,5,false,0,Math.PI);
  const stabilizer = new THREE.Mesh(stageo,enemymaterial);
  stabilizer.position.z = -4;
  stabilizer.position.y = -0.6;
  stabilizer.rotateZ(Math.PI/2);
  stabilizer.rotateY(Math.PI/2);


  //enemy.add(stabilizer);
  //
  // wings

  const length = 12, width = 0.5;

  const shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, width );
  shape.lineTo( length-5, width );
  shape.lineTo( length+5, width/2 );
  shape.lineTo(length-5,0);
  shape.lineTo( 0, 0 );

  const extrudeSettings = {
  	steps: 2,
  	depth: 16,
  	bevelEnabled: true,
  	bevelThickness: 1,
  	bevelSize: 1,
  	bevelOffset: 3,
  	bevelSegments: 1
  };

  const exgeo = new THREE.ExtrudeGeometry( shape, extrudeSettings );

  const wing = new THREE.Mesh( exgeo, wingmat ) ;
  wing.scale.set(1,0.2,0.7);
  wing.rotateX(-Math.PI/2);
  wing.rotateZ(Math.PI/8);
  wing.position.set(5,3,-1);
  enemy.add( wing );
  const wing1 = new THREE.Mesh( exgeo, wingmat ) ;
  wing1.scale.set(1,0.2,0.7);
  wing1.rotateX(-Math.PI/2);
  wing1.rotateZ(-Math.PI/8);
  wing1.position.set(5,3,2);
  enemy.add( wing1 );

  const wing2 = new THREE.Mesh( exgeo, wingmat ) ;
  wing2.scale.set(1,0.2,0.7);
  wing2.rotateX(-Math.PI/2);
  wing2.rotateZ(Math.PI/8);
  wing2.rotateY(Math.PI);
  wing2.position.set(-5,14,2);
  enemy.add( wing2 );
  const wing3 = new THREE.Mesh( exgeo, wingmat ) ;
  wing3.scale.set(1,0.2,0.7);
  wing3.rotateX(-Math.PI/2);
  wing3.rotateZ(-Math.PI/8);
  wing3.rotateY(Math.PI);
  wing3.position.set(-5,14,-1);
  enemy.add( wing3 );

  const torgeo = new THREE.TorusGeometry(14,2,5,40);
  const torus = new THREE.Mesh(torgeo,torumaterial);
  torus.position.y = -16;
  torus.rotateX(Math.PI);
  torus.rotateZ(-Math.PI/6);
  enemy.add(torus);

  const ring1geo = new THREE.TorusGeometry(9,1,3,70);
  const ring1 = new THREE.Mesh(ring1geo,ringsmaterial);
  ring1.position.y = -16;
  enemy.add(ring1);

  const ring2geo = new THREE.TorusGeometry(5,1,3,70);
  const ring2 = new THREE.Mesh(ring2geo,ringsmaterial);
  ring2.position.y = -16;
  enemy.add(ring2);

  const cpgeo = new THREE.SphereGeometry(5,5,30,-0.3,3.6,0,3.14);
  const cpit = new THREE.Mesh(cpgeo,cpitmaterial);
  cpit.position.z = -2.5;
  cpit.rotateY(Math.PI);
  enemy.add(cpit);



  const shooter = new THREE.Object3D();

  const splanegeo = new THREE.BoxGeometry(5,1,0.5);
  const shplane = new THREE.Mesh(splanegeo,enemymaterial);
  //shplane.position.z = -15;
  //shplane.rotateZ(Math.PI/2);
  shooter.add(shplane);

  const blast1geo = new THREE.CylinderGeometry(0.1,0.3,3,20,20);
  const blaster1 = new THREE.Mesh(blast1geo,shootmaterial);
  blaster1.position.x = -2;
  blaster1.position.z = 1.65;
  blaster1.rotation.x = Math.PI/2;
  shooter.add(blaster1);

  const blast2geo = new THREE.CylinderGeometry(0.1,0.3,3,20,20);
  const blaster2 = new THREE.Mesh(blast1geo,shootmaterial);
  blaster2.position.x = 2;
  blaster2.position.z = 1.65;
  blaster2.rotation.x = Math.PI/2;
  shooter.add(blaster2);

  shooter.position.y = 35;
  shooter.rotation.x = -Math.PI/2;
  enemy.add(shooter);

  enemy.rotateX(Math.PI/2);
  //enemy.scale.set(0.2,0.2,0.2);

  return enemy;
}
