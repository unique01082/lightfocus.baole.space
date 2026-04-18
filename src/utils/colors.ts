/**
 * Color utilities for the application
 */

const PLANET_COLORS = [
  '#4cc9f0', '#7209b7', '#f77f00', '#2a9d8f',
  '#e63946', '#457b9d', '#e9c46a', '#264653',
  '#ff6b6b', '#48bfe3', '#72efdd', '#ffd166',
];

export function getRandomColor(): string {
  return PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)];
}
