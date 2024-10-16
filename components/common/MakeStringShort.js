import { useState } from "react";

const MakeStringShort = ({ content, moreHandler, btnColor }) => {
  let lengthToDisplay = 200;
  const [isLong, setIslong] = useState(content.length >= lengthToDisplay);
  return isLong ? (
    <>
      {content.slice(0, lengthToDisplay)}...{" "}
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
    <>{content}</>
  );
};

export default MakeStringShort;
