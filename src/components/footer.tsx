import React from "react";
import IFooterLink from "../interfaces/footer";
import { footerLinks } from "./constants";

const Footer = () => {
  return (
    <div className="footer">
      {footerLinks.map((element: IFooterLink) => (
        <a className="footerButton" key={element.id} href={element.link}>
          {element.title}
        </a>
      ))}
    </div>
  );
};

export default Footer;
