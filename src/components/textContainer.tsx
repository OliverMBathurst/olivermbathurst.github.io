import React from "react";
import IHeader from "../interfaces/header";
import { headings, footerLinks } from "../constants";
import IFooterLink from "../interfaces/footer";

const TextContainer = () => {
  return (
    <>
      <div className="headingContainer">
        <div className="overlay" />
        {headings.map((heading: IHeader, index) => (
          <span key={index} className={heading.class}>
            {heading.title}
          </span>
        ))}
        <div className="buttonContainer">
          {footerLinks.map((element: IFooterLink) => (
            <a className="headerButton" key={element.id} href={element.link}>
              {element.image ? (
                <img
                  alt={element.image.altText}
                  className="image"
                  src={element.image.uri}
                />
              ) : (
                element.title
              )}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(TextContainer);
