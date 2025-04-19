export function getRandomBoundedCoord(
  min: number,
  max: number,
  offset?: number,
) {
  const coord = (offset || 0) + min + Math.random() * (max - min);
  return coord;
}
