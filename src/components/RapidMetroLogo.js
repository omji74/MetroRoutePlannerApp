export default function RapidMetroLogo({ size = 40 }) {
  return (
    <svg width={size} height={size}>
      <circle cx="50" cy="50" r="45" fill="#006937" />

      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="14">
        RM
      </text>
    </svg>
  );
}
