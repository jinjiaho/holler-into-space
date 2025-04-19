import * as THREE from "three";
import type { SceneProps } from "../types";
import Particle from "./Particle";
import { NUM_PARTICLES, PARTICLE_INTERVAL } from "../config";

class Scene {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement;
  camera: THREE.Camera;
  width: number;
  height: number;
  fov: number;
  aspectRatio?: number;
  boundingBox: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  particles: Particle[];
  particlesLeft: number;
  particleInterval: number;

  constructor({
    width = window.innerWidth,
    height,
    fov = 24,
    near = 1,
    far = 1000,
    cameraDistance = 5,
    container,
    aspectRatio = 16 / 9,
  }: SceneProps) {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.002);

    this.width = width;
    this.height = height;
    this.addCamera({
      width: fov,
      height: fov / aspectRatio,
      near,
      far,
      z: cameraDistance,
    });
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.container = container || document.body;
    this.container.appendChild(this.renderer.domElement);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.particles = [];
    this.particlesLeft = NUM_PARTICLES;
  }

  addCamera({ width, height, near, far, z }) {
    const minX = width / -2;
    const maxX = width / 2;
    const minY = height / -2;
    const maxY = height / 2;

    this.camera = new THREE.OrthographicCamera(
      minX,
      maxX,
      maxY,
      minY,
      near,
      far,
    );
    this.camera.position.z = z;
    this.boundingBox = {
      minX,
      maxX,
      minY,
      maxY,
      minZ: -10,
      maxZ: z,
    };
  }

  startParticleSystem() {
    this.particleInterval = setInterval(() => {
      this.particles.forEach((p, i) => {
        if (p.toBeRemoved) {
          this.scene.remove(p.mesh);
          this.particles.splice(i, 1);
          this.particlesLeft += 1;
        }
      });
      if (this.particlesLeft > 0) {
        const particle = new Particle({
          boundingBox: this.boundingBox,
        });
        this.particles.push(particle);
        this.scene.add(particle.get());
        this.particlesLeft -= 1;
      }
    }, PARTICLE_INTERVAL);
  }

  stopParticleSystem() {
    clearInterval(this.particleInterval);
    this.particleInterval = null;
  }

  render() {
    this.startParticleSystem();
    this.renderer.setAnimationLoop(() => {
      this.particles.forEach((p) => {
        p.animate();
      });
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export default Scene;
