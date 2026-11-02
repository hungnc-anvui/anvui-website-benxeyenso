import type { SVGProps } from "react";

/** Path data from Figma components "YS/Icon/*" (2:125 → 2:193), 24×24, stroke 1.7. */
const PATHS = {
  search: [
    "M17 10.5C17 14.0899 14.0899 17 10.5 17C6.91015 17 4 14.0899 4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5Z",
    "M16 16L21 21",
  ],
  pin: [
    "M20 10C20 16 12 22 12 22C12 22 4 16 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z",
    "M14.5 10C14.5 11.3807 13.3807 12.5 12 12.5C10.6193 12.5 9.5 11.3807 9.5 10C9.5 8.61929 10.6193 7.5 12 7.5C13.3807 7.5 14.5 8.61929 14.5 10Z",
  ],
  calendar: [
    "M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z",
    "M7 3V7M17 3V7M3 10H21M7 14H10M14 14H17M7 18H10",
  ],
  clock: [
    "M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z",
    "M12 6V12L16 14",
  ],
  phone: ["M6 3L10 7L8 10C10 13 11 14 14 16L17 14L21 18L19 21C9 21 3 15 3 5L6 3Z"],
  menu: ["M4 6H20M4 12H20M4 18H20"],
  bus: [
    "M8 3H16C17.6569 3 19 4.34315 19 6V17C19 18.6569 17.6569 20 16 20H8C6.34315 20 5 18.6569 5 17V6C5 4.34315 6.34315 3 8 3Z",
    "M5 12H19M8 20V22M16 20V22M8 16H9M15 16H16M9 6H15",
  ],
  wifi: [
    "M2 7.99999C4.8378 5.72794 8.36471 4.48999 12 4.48999C15.6353 4.48999 19.1622 5.72794 22 7.99999M5 12C6.97055 10.3744 9.44545 9.48528 12 9.48528C14.5545 9.48528 17.0295 10.3744 19 12M8 16C9.10004 15.0161 10.5241 14.4721 12 14.4721C13.4759 14.4721 14.9 15.0161 16 16M12 20H12.01",
  ],
  water: ["M15 7V3H9V7M15 7L17 11V13M15 7H9M17 13V21H7V13M17 13H7M7 13V11L9 7"],
  usb: [
    "M12 21V18M12 18V15M12 18L18 13V9M12 15V3M12 15L6 10V7M15 6L12 3L9 6",
    "M7 6C7 6.55228 6.55228 7 6 7C5.44772 7 5 6.55228 5 6C5 5.44772 5.44772 5 6 5C6.55228 5 7 5.44772 7 6Z",
    "M17 6H19V9H17V6Z",
  ],
  shield: ["M12 2L20 6V12C20 17 12 22 12 22C12 22 4 17 4 12V6L12 2Z", "M8 12L11 15L16 9"],
  ticket: [
    "M15 6H3V10C3.53043 10 4.03914 10.2107 4.41421 10.5858C4.78929 10.9609 5 11.4696 5 12C5 12.5304 4.78929 13.0391 4.41421 13.4142C4.03914 13.7893 3.53043 14 3 14V18H15M15 6H21V10C20.4696 10 19.9609 10.2107 19.5858 10.5858C19.2107 10.9609 19 11.4696 19 12C19 12.5304 19.2107 13.0391 19.5858 13.4142C19.9609 13.7893 20.4696 14 21 14V18H15M15 6V9M15 18V16M15 12V14",
  ],
  arrow: ["M3 12H21M15 18L21 12L15 6"],
  swap: ["M3 7H21M17 11L21 7L17 3M21 17H3M7 21L3 17L7 13"],
  check: ["M4 12L9 17L20 6"],
  bag: [
    "M7 7H17C18.1046 7 19 7.89543 19 9V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V9C5 7.89543 5.89543 7 7 7Z",
    "M9 7V3H15V7M9 11V17M15 11V17",
  ],
  close: ["M6 6L18 18M18 6L6 18"],
  "chevron-left": ["M15 6L9 12L15 18"],
  "chevron-right": ["M9 6L15 12L9 18"],
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  size?: number;
  /** Provide a label for meaningful icons; decorative icons stay hidden from assistive tech. */
  label?: string;
};

export function Icon({ name, size = 24, label, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      {...props}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
