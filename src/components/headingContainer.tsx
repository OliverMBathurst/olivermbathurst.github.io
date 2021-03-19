import React from "react";
import IHeader from "../interfaces/header";
import { headings } from "../constants";

const HeadingContainer = () => {
  return (
    <div className="headingContainer">
      {headings.map((heading: IHeader, index) => (
        <span key={index} className={heading.class}>
          {heading.title}
        </span>
      ))}
    </div>
  );
};

export default React.memo(HeadingContainer);
