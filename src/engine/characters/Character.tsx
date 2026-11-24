import React from "react";
import { Hand } from "./Hand";
import { WaterBottle } from "../objects/WaterBottle";

export type CharacterExpression =
  | "happy"
  | "surprised"
  | "sad"
  | "neutral"
  | "effort"
  | "tired";
export type HandGesture =
  | "fist"
  | "thumbsUp"
  | "open"
  | "point"; 
export type CharacterAppearance = {
  muscularity?: number;
  upperBodyMuscularity?: number;
  lowerBodyMuscularity?: number;
  shirtColor?: string;
  shortsColor?: string;
  shoeColor?: string;
  skinColor?: string;
  hairColor?: string;
  hairStyle?: "spiky" | "short";
};
export type CharacterProps = {
  appearance?: CharacterAppearance;
  dumbbells?: boolean;
  fatigue?: number;
  expression?: CharacterExpression;
  blink?: number;
  headTilt?: number;
  leftArm?: number;
  rightArm?: number;
  leftLeg?: number;
  rightLeg?: number;
  leftHand?: HandGesture;
rightHand?: HandGesture;
leftElbow?: number;
rightElbow?: number;
leftKnee?: number;
rightKnee?: number;
heldObject?: "none" | "waterBottle";
mouthOpen?: number;
objectRotation?: number;
objectOffsetX?: number;
objectOffsetY?: number;
bottleOpen?: boolean;
};

export const Character: React.FC<CharacterProps> = ({
  appearance = {},
  dumbbells = false,
  fatigue = 0,
  expression = "happy",
  blink = 0,
  headTilt = 0,
  leftArm = 0,
  rightArm = 0,
  leftLeg = 0,
  rightLeg = 0,
  leftHand = "fist",
  rightHand = "fist",
  leftElbow = 0,
rightElbow = 0,
leftKnee = 0,
rightKnee = 0,
heldObject = "none",
mouthOpen = 1,
objectRotation = 0,
objectOffsetX = -5,
objectOffsetY = -30,
bottleOpen = false,
}) => {
  const muscle = Math.max(0, Math.min(1, appearance.upperBodyMuscularity ?? appearance.muscularity ?? 0));
  const legs = Math.max(0, Math.min(1, appearance.lowerBodyMuscularity ?? appearance.muscularity ?? 0));
  const ink = "#111111";
  const skin = appearance.skinColor ?? "#ffba80";
  const flush = Math.max(0, Math.min(1, fatigue));
  const red = appearance.shirtColor ?? "#ff241c";
  const blue = appearance.shortsColor ?? "#1464ff";
  const yellow = appearance.shoeColor ?? "#ffda00";

  const sticker = {
    stroke: "#ffffff",
    strokeWidth: 26,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
    paintOrder: "stroke" as const,
  };

  const outline = {
    stroke: ink,
    strokeWidth: 9,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  const shoe =
    "M -15 -12 Q -35 -22 -42 8 " +
    "Q -85 12 -85 45 Q -50 65 35 43 " +
    "Q 40 18 15 5 L 15 -12 Z";

  const shoulder = 48 * muscle;
  const chest = 28 * muscle;
  const waist = 24 * muscle;
  const shirt = muscle === 0 ? "M 210 340 L 150 375 L 185 440 L 225 410 L 200 560 L 400 560 L 375 410 L 415 440 L 450 375 L 390 340 Z" : `M ${210-shoulder*.6} 340 Q ${170-shoulder} 345 ${150-shoulder} 375 L ${185-shoulder} 440 L ${225-chest} 410 Q ${215-chest} 470 ${200+waist} 560 L ${400-waist} 560 Q ${385+chest} 470 ${375+chest} 410 L ${415+shoulder} 440 L ${450+shoulder} 375 Q ${430+shoulder} 345 ${390+shoulder*.6} 340 Z`;
  const shorts = `M ${205+waist} 560 L ${395-waist} 560 L ${420+12*legs} 670 L 320 690 L 300 610 L 280 690 L ${180-12*legs} 670 Z`;

  const hair = appearance.hairStyle === "short"
    ? "M 145 210 Q 120 70 260 65 Q 400 40 455 155 L 455 210 L 420 160 Q 300 185 190 145 Z"
    :
    "M 155 220 Q 80 250 125 195 " +
    "L 90 190 Q 110 150 185 130 " +
    "Q 100 90 155 85 L 225 115 " +
    "Q 225 20 260 55 L 270 110 " +
    "Q 325 5 345 45 L 310 105 " +
    "Q 410 15 420 55 L 365 115 " +
    "Q 490 50 470 95 L 405 135 " +
    "Q 535 115 485 160 L 430 165 " +
    "L 390 130 L 300 125 L 215 155 Z";

  return (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 600 1000"
  width={600}
  height={1000}
  style={{ overflow: "visible" }}
>
      <defs>
        <pattern
          id="crayon"
          width="23"
          height="23"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-35)"
        >
          <path
            d="M 0 3 H 18 M 4 9 H 22 M 0 17 H 12"
            stroke="white"
            strokeWidth="1.7"
            opacity="0.65"
          />
          <path
            d="M 2 6 H 10 M 12 20 H 23"
            stroke="white"
            strokeWidth="0.8"
            opacity="0.45"
          />
        </pattern>
      </defs>

{/* Piernas */}
{[-1, 1].map((side) => {
  const legAngle = side === -1 ? leftLeg : rightLeg;
  const kneeAngle = side === -1 ? leftKnee : rightKnee;

  return (
    <g
      key={side}
      transform={`translate(${300 + side * 60} 650)
        rotate(${legAngle})`}
    >
      {/* Muslo */}
      <path
        d={`M 0 0 L ${side * 12} 95`}
        stroke="white"
        strokeWidth={36 + 42 * legs}
        strokeLinecap="round"
        fill="none"
      />

      <path
        d={`M 0 0 L ${side * 12} 95`}
        stroke={ink}
        strokeWidth={16 + 42 * legs}
        strokeLinecap="round"
        fill="none"
      />

      {legs > 0 && <path d={`M 0 0 L ${side * 12} 95`} stroke={skin} strokeWidth={Math.max(0, 42 * legs - 2)} strokeLinecap="round" fill="none" />}
      {/* Rodilla y pantorrilla */}
      <g
        transform={`translate(${side * 12} 95)
          rotate(${kneeAngle})`}
      >
        <path
          d={`M 0 0 L ${side * 13} 95`}
          stroke="white"
          strokeWidth={36 + 30 * legs}
          strokeLinecap="round"
          fill="none"
        />

        <path
          d={`M 0 0 L ${side * 13} 95`}
          stroke={ink}
          strokeWidth={16 + 30 * legs}
          strokeLinecap="round"
          fill="none"
        />

        {legs > 0 && <path d={`M 0 0 L ${side * 13} 95`} stroke={skin} strokeWidth={Math.max(0, 30 * legs - 2)} strokeLinecap="round" fill="none" />}
        {/* Zapatilla */}
        <g
          transform={`translate(${side * 13} 95)
            rotate(${-(legAngle + kneeAngle) * 0.5})
            scale(${-side} 1)`}
        >
          <path d={shoe} fill={yellow} {...sticker} />
          <path d={shoe} fill={yellow} {...outline} />
          <path d={shoe} fill="url(#crayon)" />

          <path
            d="M -80 39 Q -20 53 35 32"
            stroke={ink}
            strokeWidth={7}
            fill="none"
          />

          <path
            d="M -35 12 L -20 26 M -15 8 L 0 22"
            stroke={ink}
            strokeWidth={7}
            strokeLinecap="round"
          />
        </g>
      </g>
    </g>
  );
})}



      {/* Pantalón */}
      <path d={shorts} fill={blue} {...sticker} />
      <path d={shorts} fill={blue} {...outline} />
      <path d={shorts} fill="url(#crayon)" />

      {/* Camiseta */}
      <path d={shirt} fill={red} {...sticker} />
      <path d={shirt} fill={red} {...outline} />
      <path d={shirt} fill="url(#crayon)" />

      {muscle > 0 && (
        <g fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round" opacity={muscle * .85}>
          <path d={`M ${230-chest*.6} 386 Q 260 371 294 391 L 294 426 Q 260 448 ${230-chest*.6} 425 M ${370+chest*.6} 386 Q 340 371 306 391 L 306 426 Q 340 448 ${370+chest*.6} 425`} strokeWidth={5} />
          <path d="M 300 444 L 300 539 M 270 457 Q 283 450 294 457 M 306 457 Q 317 450 330 457 M 270 482 Q 283 489 294 482 M 306 482 Q 317 489 330 482 M 274 510 Q 285 517 294 510 M 306 510 Q 315 517 326 510 M 267 455 Q 260 497 280 539 M 333 455 Q 340 497 320 539" strokeWidth={4} opacity={.85} />
        </g>
      )}
      {/* Cuello */}
      <ellipse
        cx="300"
        cy="350"
        rx="35"
        ry="25"
        fill={skin}
        {...outline}
      />

      {/* Cabeza */}
      <g transform={`rotate(${headTilt} 300 340)`}>
        <ellipse
          cx="300"
          cy="220"
          rx="160"
          ry="145"
          fill={skin}
          {...sticker}
        />

        <ellipse
          cx="300"
          cy="220"
          rx="160"
          ry="145"
          fill={skin}
          {...outline}
        />

        <ellipse
          cx="300"
          cy="220"
          rx="154"
          ry="139"
          fill="url(#crayon)"
        />

        <ellipse cx="300" cy="220" rx="154" ry="139" fill="#ef3030" opacity={flush * 0.88} />
        {flush > 0.45 && (
          <path d="M 412 170 Q 389 205 410 211 Q 431 205 412 170 Z" fill="#7dd3fc" stroke="#111" strokeWidth={3} opacity={Math.min(1, (flush - 0.45) * 3)} />
        )}
        {/* Pelo */}
        <path d={hair} fill={appearance.hairColor ?? ink} {...sticker} />
        <path d={hair} fill={appearance.hairColor ?? ink} {...outline} />
        <path d={hair} fill="url(#crayon)" />

        {/* Cejas */}
        <path
          d={expression === "effort" ? "M 220 165 L 260 190 M 320 190 L 360 165" : "M 220 188 Q 240 153 260 177 M 320 177 Q 340 145 360 168"}
          fill="none"
          stroke={ink}
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Ojos */}
        {[250, 345].map((x) => (
          <ellipse
            key={x}
            cx={x}
            cy="220"
            rx="12"
            ry={Math.max(2, (expression === "effort" ? 9 : expression === "tired" ? 13 : 25) * (1 - blink))}
            fill={ink}
            transform={`rotate(-10 ${x} 220)`}
          />
        ))}

        {/* Boca */}
{expression === "happy" && (
  <g
    transform={`
  translate(0 290)
  scale(1 ${0.12 + mouthOpen * 0.88})
  translate(0 -290)
`}
  >
    <path
      d="M 215 260 Q 300 295 385 245
         Q 350 365 280 330
         Q 230 310 215 260 Z"
      fill={ink}
      {...outline}
    />
    <path
      d="M 246 303 Q 300 275 346 305
         Q 300 350 246 303 Z"
      fill="#ff241c"
    />
  </g>
)}

        {expression === "surprised" && (
          <ellipse
            cx="300"
            cy="290"
            rx="30"
            ry="40"
            fill={ink}
          />
        )}

        {expression === "sad" && (
          <path
            d="M 260 310 Q 300 265 340 310"
            fill="none"
            stroke={ink}
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}

        {expression === "effort" && (
          <g><rect x="252" y="270" width="96" height="36" rx="9" fill="white" {...outline} /><path d="M 255 288 H 345 M 278 272 V 304 M 300 272 V 304 M 322 272 V 304" stroke={ink} strokeWidth="4" /></g>
        )}
        {expression === "tired" && (
          <ellipse cx="300" cy="290" rx="25" ry="18" fill={ink} />
        )}
        {expression === "neutral" && (
          <path
            d="M 265 285 Q 300 290 335 280"
            fill="none"
            stroke={ink}
            strokeWidth="9"
            strokeLinecap="round"
          />
        )}
      </g>
      {/* Brazos */}
{[-1, 1].map((side) => {
  const armAngle = side === -1 ? leftArm : rightArm;
  const elbowAngle = side === -1 ? leftElbow : rightElbow;
  const gesture = side === -1 ? leftHand : rightHand;

  return (
    <g
      key={side}
      transform={`translate(${300 + side * (120 + 38 * muscle)} 390)
        rotate(${armAngle})`}
    >
      {/* Brazo superior */}
      <path
        d={`M 0 0 L ${side * 65} 80`}
        stroke="white"
        strokeWidth={34 + 35 * muscle}
        strokeLinecap="round"
        fill="none"
      />

      <path
        d={`M 0 0 L ${side * 65} 80`}
        stroke={ink}
        strokeWidth={14 + 35 * muscle}
        strokeLinecap="round"
        fill="none"
      />

      {muscle > 0 && <path d={`M 0 0 L ${side * 65} 80`} stroke={skin} strokeWidth={Math.max(0, 35 * muscle - 2)} strokeLinecap="round" fill="none" />}
      {/* Codo */}
      <g
        transform={`translate(${side * 65} 80)
          rotate(${elbowAngle})`}
      >
        {/* Antebrazo */}
        <path
          d={`M 0 0 L ${-side * 30} 70`}
          stroke="white"
          strokeWidth={34 + 35 * muscle}
          strokeLinecap="round"
          fill="none"
        />

        <path
          d={`M 0 0 L ${-side * 30} 70`}
          stroke={ink}
          strokeWidth={14 + 35 * muscle}
          strokeLinecap="round"
          fill="none"
        />

        {muscle > 0 && <path d={`M 0 0 L ${-side * 30} 70`} stroke={skin} strokeWidth={Math.max(0, 26 * muscle - 2)} strokeLinecap="round" fill="none" />}
        {/* Mano */}
        <g
          transform={`translate(${-side * 30} 70)
            rotate(${-armAngle - elbowAngle})`}
        >
          {/* Objeto sujeto */}
{side === 1 && heldObject === "waterBottle" && (
  <g
    transform={`translate(
      ${objectOffsetX}
      ${objectOffsetY}
    ) rotate(${objectRotation})`}
  >
    <WaterBottle open={bottleOpen} />
  </g>
)}

          {dumbbells && (
            <g transform="translate(0 0)">
              <rect x="-53" y="-8" width="106" height="16" rx="5" fill="#aab7c5" stroke={ink} strokeWidth="5" />
              {[-1, 1].map((end) => (
                <rect key={end} x={end * 46 - 16} y="-33" width="32" height="66" rx="8" fill="#394658" stroke="white" strokeWidth="5" />
              ))}
            </g>
          )}
          <g transform={`scale(${side} 1)`}>
            <Hand gesture={gesture} />
          </g>
        </g>
      </g>
    </g>
  );
})}
    </svg>
  );
};