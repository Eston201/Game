import * as THREE from '../js/three.module.js';

export{PlanetBelt,PlanetA, Portal};


function PlanetBelt() {


    const gravplanet = new THREE.Object3D();

    const asttext = new THREE.TextureLoader().load(
        'resources/textures/spacerock.jpg'
    );

    const bgeo = new THREE.SphereGeometry(3,32,32);
    const bmat = new THREE.MeshBasicMaterial({map : asttext});


    const rotval = (1/50)*2*Math.PI;
    for (let i=0;i<50;i++){
        const belt = new THREE.Mesh(bgeo,bmat);
         belt.position.x = 162*Math.cos(i*rotval);
         belt.position.z = 162*Math.sin(i*rotval);
         belt.position.y = 30*Math.sin(i*rotval);
         gravplanet.add(belt);

    }


    return gravplanet;

}

function PlanetA(pval){
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
    const plan = new THREE.Mesh(pgeo,pmat);

    return plan;

}

function Portal(v) {
    const portal2text = new THREE.TextureLoader().load(
        'resources/textures/redeclipse_ft.png'
    );
    const portal3text = new THREE.TextureLoader().load(
        'resources/textures/arid2_ft.jpg'
    );

    const parr = [portal2text,portal3text];
    const portalgeo = new THREE.CylinderGeometry(40,40,0.5,50);
    const portalmat = new THREE.MeshPhongMaterial({map: parr[v]})
    const portal = new THREE.Mesh(portalgeo,portalmat);

    return portal;
}
