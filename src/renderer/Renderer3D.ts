import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DrawCommand3D, RenderOptions3D } from '../types/lsystem';

export class Renderer3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private linesGroup: THREE.Group;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.linesGroup = new THREE.Group();
    this.scene.add(this.linesGroup);

    this.addLights();
  }

  render(commands: DrawCommand3D[], options: RenderOptions3D): void {
    this.clearLines();

    const points: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const color = new THREE.Color(options.lineColor || '#00ff88');

    for (const cmd of commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        points.push(
          new THREE.Vector3(cmd.from.x, cmd.from.y, cmd.from.z),
          new THREE.Vector3(cmd.to.x, cmd.to.y, cmd.to.z)
        );
        colors.push(color, color);
      }
    }

    if (points.length > 0) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(
        colors.flatMap(c => [c.r, c.g, c.b]), 3
      ));

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: options.lineWidth || 1,
      });

      const lineSegments = new THREE.LineSegments(geometry, material);
      this.linesGroup.add(lineSegments);

      this.autoCenterAndZoom();
    }

    this.animate();
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);
  }

  private autoCenterAndZoom(): void {
    const box = new THREE.Box3().setFromObject(this.linesGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    this.linesGroup.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const distance = (maxDim / 2) / Math.tan(fov / 2) * 2;

    this.camera.position.set(distance, distance, distance);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  clearLines(): void {
    while (this.linesGroup.children.length > 0) {
      const child = this.linesGroup.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
      this.linesGroup.remove(child);
    }
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  exportToPNG(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose(): void {
    this.clearLines();
    this.controls.dispose();
    this.renderer.dispose();
  }

  resetCamera(): void {
    this.camera.position.set(5, 5, 5);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }
}