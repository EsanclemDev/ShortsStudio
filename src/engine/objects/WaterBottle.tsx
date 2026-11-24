export const WaterBottle = ({
  open = false,
}: {
  open?: boolean;
}) => {
  const shape = `
    M -15 -75
    L 15 -75
    L 15 -55
    Q 34 -48 34 -28
    L 34 65
    Q 34 78 20 78
    L -20 78
    Q -34 78 -34 65
    L -34 -28
    Q -34 -48 -15 -55
    Z
  `;

  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d={shape}
        fill="#8ce3ff"
        stroke="white"
        strokeWidth={20}
        paintOrder="stroke"
      />

      <path
        d={shape}
        fill="#8ce3ff"
        stroke="#111111"
        strokeWidth={6}
      />

      {/* Agua */}
      <path
        d="M -30 0 Q 0 -12 30 0 L 30 65
           Q 30 74 20 74 L -20 74
           Q -30 74 -30 65 Z"
        fill="#159fff"
      />

      {/* Etiqueta */}
      <rect
        x={-31}
        y={5}
        width={62}
        height={35}
        rx={4}
        fill="white"
        stroke="#111111"
        strokeWidth={3}
      />

      <text
        x={0}
        y={27}
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
        fill="#1464ff"
      >
        AGUA
      </text>

      {/* Tapón */}
{!open && (
  <rect
    x={-19}
    y={-88}
    width={38}
    height={18}
    rx={4}
    fill="#1464ff"
    stroke="#111111"
    strokeWidth={5}
  />
)}

{/* Boquilla abierta */}
{open && (
  <ellipse
    cx={0}
    cy={-75}
    rx={15}
    ry={4}
    fill="#073c59"
    stroke="#111111"
    strokeWidth={4}
  />
)}
    </g>
  );
};