export const AptitudeTestProgressCircle = ({ percentage }) => {
    const radius = 15.915; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle

  // Calculate stroke-dasharray value based on percentage
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
        <svg width="50" height="50" viewBox="0 0 36 36">
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="#E6E6E6"
        strokeWidth="2"
      />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="#2C3E50"
        strokeWidth="2"
        strokeDasharray={strokeDasharray}
        transform="rotate(-90 18 18)"
      />
    </svg>
    );
};
