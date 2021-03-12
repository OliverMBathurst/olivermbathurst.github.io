import React from 'react';
import { footerLinks } from './constants'
import IFooterLink from '../interfaces/footer';

const Footer = () => {
  return (
    <div className = "footer">
        {footerLinks.map((footer: IFooterLink, index: number) => <a className = "footerButton" key = {index} href = {footer.link}>{footer.title}</a>)}
    </div>
  )
}

export default Footer;