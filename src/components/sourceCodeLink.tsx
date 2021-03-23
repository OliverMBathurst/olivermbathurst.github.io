import React from "react";
import { sourceCodeLink } from "../constants";

const SourceCodeLink = () => {
  const { link, title, id } = sourceCodeLink;

  return (
    <a className="sourceCodeButton" href={link} key={id}>
      {title}
    </a>
  );
};

export default React.memo(SourceCodeLink);
