export default function DMRCLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="#003087" />

      <text
        x="50"
        y="55"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
      >
        DMRC
      </text>
    </svg>
  );
}
