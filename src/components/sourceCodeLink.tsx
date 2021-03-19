import React from "react";
import { sourceCodeLink } from "../constants";

const SourceCodeLink = () => {
  const { link, title, id } = sourceCodeLink;

  return (
    <div className="bottomFooter">
      <a className="footerButton" href={link} key={id}>
        {title}
      </a>
    </div>
  );
};

export default React.memo(SourceCodeLink);
