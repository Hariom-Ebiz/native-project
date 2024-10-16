import { useState } from "react";

const MakeListShort = ({ content, moreHandler, btnColor }) => {
  let lengthToDisplay = 2;
  const [isLong, setIslong] = useState(content.length > lengthToDisplay);
  return false ? (
    <>
      {content.map((val, i) => {
        return i < lengthToDisplay ? <li key={i}>{val}</li> : null;
      })}
      <span
        onClick={moreHandler}
        style={{
          color: btnColor,
          cursor: "pointer",
          fontWeight: "bold",
          fontStyle: "italic",
        }}
      >
        read more
      </span>
    </>
  ) : (
    <>
      {content.map((val, i) => {
        return <li key={i}>{val}</li>;
      })}
    </>
  );
};

export default MakeListShort;
