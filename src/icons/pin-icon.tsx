import React from "react";

const PinIcon = ({ size = 25 }: { size?: number }) => {
  return (
    <svg
      data-name="Layer 1"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M32 8a18.87 18.87 0 0 0-18.87 18.87C13.13 39.26 28.47 56 32 56s18.87-16.27 18.87-29.13A18.87 18.87 0 0 0 32 8Zm-.09 33a13.44 13.44 0 1 1 13.44-13.44A13.44 13.44 0 0 1 31.91 41Zm0 0"
        // fill="#f29992"
        className="fill-primary"
      ></path>
      <path
        d="M31.91 16.73a.52.52 0 0 0-.44.78 5.21 5.21 0 0 1 .75 2.59A5.35 5.35 0 0 1 27 25.49a5.25 5.25 0 0 1-4.2-2.08.53.53 0 0 0-.9.13 10.68 10.68 0 0 0-.76 4.53 10.84 10.84 0 1 0 10.77-11.34Zm0 0"
        // fill="#f9b4ab"
        className="fill-primary-light"
      ></path>
    </svg>
  );
};

export default PinIcon;
