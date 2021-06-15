import * as THREE from '../js/three.module.js';
export{asteroid}


function asteroid(shippos){
    const astte = new THREE.TextureLoader().load(
        './resources/textures/spacerock.jpg'
    );
    const astmat = new THREE.MeshLambertMaterial({map: astte});
    const astgeo = new THREE.SphereGeometry(10,50,50);
    
    const ast = new THREE.Mesh(astgeo,astmat);

    const sx = shippos.prod.position.x;
    const sy = shippos.prod.position.y;
    const sz = shippos.prod.position.z;
 
    ast.position.set(sx,sy,sz - 1000);

    return(ast);
}