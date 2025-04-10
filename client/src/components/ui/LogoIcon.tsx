const LogoIcon = () => {
  return (
    <svg
      width="200"
      height="48"
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Votely logo"
    >
      {/* Background  */}
      <rect width="100%" height="100%" fill="rgb(15, 89, 193)" />

      {/* Improved Ballot box icon */}
      <g transform="translate(10, 4)">
        {/* Box base  */}
        <rect x="0" y="10" width="32" height="30" rx="5" ry="5" fill="white" />
        {/* Slot  */}
        <rect
          x="8"
          y="12"
          width="16"
          height="4"
          rx="1"
          fill="rgb(15, 89, 193)"
        />

        {/* Tilted paper with checkmark  */}
        <g transform="rotate(-30, 16, 2)">
          <rect
            x="10"
            y="0"
            width="14"
            height="10"
            rx="1"
            ry="1"
            fill="white"
          />
        </g>
      </g>

      {/* Votely text aligned with box top  */}
      <text
        x="50"
        y="21"
        font-family="Arial, sans-serif"
        font-size="22"
        fill="white"
        font-weight="bold"
      >
        Votely
      </text>

      {/* Larger tagline text for readability  */}
      <text
        x="50"
        y="39"
        font-family="Arial, sans-serif"
        font-size="13"
        fill="white"
      >
        Where every vote count
      </text>
      <title>Votely logo - Where every vote count</title>
    </svg>
  );
};

export default LogoIcon;
