export const NOTE_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#843B62",
  "#F9844A",
  "#90DBF4",
  "#CDB4DB",
  "#F72585",
  "#7209B7",
  "#3A86FF",
  "#06D6A0",
  "#FFBE0B",
  "#FB5607",
  "#8338EC",
  "#8AC926",
  "#FF595E",
  "#1982C4",
  "#6A4C93",
  "#dfdfdfff",
]

// deterministic hash → stable but seedable
export function getColorForNote(id: string, seed: number): string {
  let hash = 0
  const str = id + seed

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }

  const index = Math.abs(hash) % NOTE_COLORS.length
  return NOTE_COLORS[index]
}
