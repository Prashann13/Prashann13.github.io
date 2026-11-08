export function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}
export function crossesTop(previousFeet, feet, top, velocity) {
  return velocity >= 0 && previousFeet <= top + .5 && feet >= top;
}
export function footOverGap(x, width, gap) {
  const center = x + width / 2;
  return center > gap.x + 2 && center < gap.x + gap.width - 2;
}
