import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.css";
const FooterRoutes = ["", "media"];

export const FooterLinks = ({ onNavigation = undefined }) => (
  <>
    <Link to={"!#"} onClick={onNavigation} className="text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-inset">
      About
    </Link>
    <Link to={"!#"} onClick={onNavigation} className="text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-inset">
      Help
    </Link>
    <Link to={"/privacy"} onClick={onNavigation} className="text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-inset">
      Privacy
    </Link>
    <Link to={"/terms"} onClick={onNavigation} className="text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-inset">
      Terms
    </Link>
    <Link to={"!#"} onClick={onNavigation} className="text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-inset">
      Sitemap
    </Link>
  </>
);

const Footer = () => {
  const { footer } = useSelector((state) => state.layout);
  const [showFooter, setShowFooter] = useState(true);
  const location = useLocation();
  let pathArr = location.pathname.split("/");
  pathArr.shift();
  const footerContainer = FooterRoutes.includes(pathArr[0].toLowerCase()) ? "footer-right" : "footer-center";
  useEffect(() => {
    let condArr = ["ut", "ssdi", "newspaper", "census"];
    if (condArr.includes(pathArr[0].toLowerCase())) setShowFooter(false);
  }, [location]);
  return showFooter ? (
    <div id="footer" className={`py-4 footer ${footer.bgClass}`}>
      <div className={`${footerContainer}`}>
        <div className="items-center md:space-x-2 space-x-4 footer-links">
          <FooterLinks />
        </div>
        <div className="mt-1.5 mb-2 text-xs copy">2022 &copy; Storied.com</div>
      </div>
    </div>
  ) : null;
};

export default Footer;
