import * as THREE from "three";
import type { BoundingBox } from "../types";
import { getRandomBoundedCoord } from "../utils";
import { WIND } from "../config";

const RADIUS = 0.01;
const COLOR = 0xffffff;
const WEIGHT = 0.01;

class Particle {
  mesh: THREE.Mesh;
  force: THREE.Vector3;
  boundingBox: BoundingBox;
  toBeRemoved: boolean;

  constructor({ boundingBox, force = new THREE.Vector3(0, 0, 0) }) {
    const geom = new THREE.SphereGeometry(RADIUS);
    const material = new THREE.MeshPhongMaterial({
      color: COLOR,
      emissive: COLOR,
      emissiveIntensity: 0.5,
    });
    this.mesh = new THREE.Mesh(geom, material);
    this.boundingBox = {
      ...boundingBox,
      maxX: boundingBox.maxX + force.x * boundingBox.maxY,
      maxZ: boundingBox.maxZ - force.z * boundingBox.maxY,
    };
    const position = new THREE.Vector3(
      getRandomBoundedCoord(
        this.boundingBox.minX,
        this.boundingBox.maxX,
        force.x * this.boundingBox.maxY,
      ),
      boundingBox.maxY,
      getRandomBoundedCoord(boundingBox.minZ, boundingBox.maxZ),
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.force = new THREE.Vector3(WIND.x, WIND.y, WIND.z).multiplyScalar(
      WEIGHT,
    );
  }

  get() {
    return this.mesh;
  }

  animate() {
    this.mesh.position.add(this.force);
    if (this.isOutOfFrame()) {
      this.toBeRemoved = true;
    } else {
      this.toBeRemoved = false;
    }
  }

  isOutOfFrame() {
    const { x, y, z } = this.mesh.position;
    if (x < this.boundingBox.minX || x > this.boundingBox.maxX) {
      return true;
    }
    if (y < this.boundingBox.minY || y > this.boundingBox.maxY) {
      return true;
    }
    if (z < this.boundingBox.minZ || z > this.boundingBox.maxZ) {
      return true;
    }
    return false;
  }
}

export default Particle;
