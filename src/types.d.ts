export interface SceneProps {
  container: HTMLElement;
  width?: number;
  height?: number;
  fov?: number;
  near?: number;
  far?: number;
  aspectRatio?: number;
  cameraDistance?: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}
