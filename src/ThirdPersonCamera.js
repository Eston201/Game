import * as THREE from '../js/three.module.js';
export {ThirdPersonCamera}

class ThirdPersonCamera {
  constructor(params) {
    this.init(params)
  }
  init(params){
    this._params = params;
    this._camera = params.camera;
    console.log(this._camera.position);
    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }
  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(0,30,80);
    idealOffset.applyQuaternion(this._params.target.quaternion);
    idealOffset.add(this._params.target.position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0,-3,-150);
    idealLookat.applyQuaternion(this._params.target.quaternion);
    idealLookat.add(this._params.target.position);
    return idealLookat;
  }

  Update(timeElapsed) {

    
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat,t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);

  }
}
