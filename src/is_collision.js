import * as THREE from '../js/three.module.js';

function is_collision(obj1,obj2){

    var x1,y1,z1,x2,y2,z2;

    x1 = obj1.position.x;
    y1 = obj1.position.y;
    z1 = obj1.position.z;

    x2 = obj2.position.x;
    y2 = obj2.position.y;
    z2 = obj2.position.z;


    var xd = Math.pow(x1-x2,2);
    var yd = Math.pow(y1-y2,2);
    var zd = Math.pow(z1-z2,2);

    const ed = Math.sqrt(xd+yd+zd);

    if (ed < 5){
        return true;
    }else{
        return false
    }
}