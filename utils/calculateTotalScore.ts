export default function calculateTotalScore(
  points: number,
  timeInSeconds: number
): number {
  const k = 0.1;
  const totalScore = (points - timeInSeconds * k) * 100;
  return Math.max(Math.round(totalScore), 0);
}
