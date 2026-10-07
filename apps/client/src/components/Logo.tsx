export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <rect width="32" height="32" rx="8" fill="#12141c" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      {/* Precision flow vectors */}
      <path
        d="M8 12.5L16 8L24 12.5M8 19.5L16 15L24 19.5M11 24L16 21.2L21 24"
        stroke="#818cf8"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
