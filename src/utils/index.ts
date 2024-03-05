// A function to get a random int number between intervals
export function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
