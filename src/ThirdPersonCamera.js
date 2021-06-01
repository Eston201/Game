import * as THREE from '../js/three.module.js';
export {ThirdPersonCamera}
class ThirdPersonCamera {
  constructor(params) {
    this.params = params;
    this.camera = params.camera;

    this.CameraCurrentPosition = new THREE.Vector3();
    this.CameraCurrentLookat = new THREE.Vector3();
  }

  CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-15, 20, -30);
    idealOffset.Quaternion(this.params.target.Rotation);
    idealOffset.add(this.params.enemy.Position);
    return idealOffset;
  }

  CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(this.params.target.Rotation);
    idealLookat.add(this.params.enemy.Position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this.CalculateIdealOffset();
    const idealLookat = this.CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this.CameraCurrentPosition.lerp(idealOffset, t);
    this.CameraCurrentLookat.lerp(idealLookat, t);

    this.camera.position.copy(this.CameraCurrentPosition);
    this.camera.lookAt(this.CameraCurrentLookat);
  }
}
