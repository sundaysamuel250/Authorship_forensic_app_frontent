import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LiaTimesSolid } from "react-icons/lia";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import "./Navbar.css";
import Images from "../constants/Images";

interface NavLink {
  label: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationLinks: NavLink[] = [
    { label: "Home", path: "/" },
    { label: "Log in", path: "/login" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleClick = (path: string) => {
    setActiveLink(path);
    setIsMenuOpen(false);
  };

  return (
    <div className={isScrolled ? "navbar-wrapper shadow-lg" : "navbar-wrapper"}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={Images.Logo} alt="logo" className="" />
        </Link>
        <div className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? (
            <LiaTimesSolid size={34} color="#008000" className="icon" />
          ) : (
            <HiOutlineBars3BottomRight size={34} color="#FF00FF" className="icon" />
          )}
        </div>
        <nav className={`navbar-menu ${isMenuOpen ? "open" : ""} font-sans text-[16px] font-medium`}>
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`menu-link ${activeLink === link.path ? "active" : ""} font-sans`}
              onClick={() => handleClick(link.path)}
            >
              {link.label}
            </Link>
          ))}

          <div className="px-[6px]">
            <Link to="/register" onClick={toggleMenu}>
              <button className="font-sans text-[16px] font-medium text-[#FFFFFF] bg-[#ff66c4] hover:bg-[#000000] border-none py-[6px] px-[10px] rounded-[5px] justify-center ease-in duration-300">
                Register
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;