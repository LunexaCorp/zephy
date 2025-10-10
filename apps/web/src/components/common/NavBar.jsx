import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Github, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Medidor", path: "/", external: false },
  { name: "Clasificación", path: "/ranking", external: false },
  { name: "Mapa", path: "/mapa", external: false },
  { name: "Proyecto", path: "https://github.com/LunexaCorp/zephy", external: true },
];

function NavItem({ link, onClick }) {
  const isExternal = link.external;
  const commonClasses =
    "text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300";
  const activeClasses = "text-green-400 font-bold border-b-2 border-green-400";
  const icon =
    link.name === "Proyecto" && (
      <Github size={20} className="inline-block mr-2" />
    );

  const content = (
    <>
      {icon}
      {link.name}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={link.path}
        target="_blank"
        rel="noopener noreferrer"
        className={`${commonClasses} flex items-center`}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `${commonClasses} ${isActive ? activeClasses : ""} flex items-center`
      }
      onClick={onClick}
    >
      {content}
    </NavLink>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Nombre */}
          <Link
            to="/"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all duration-300"
          >
            <img
              src="/zephy.svg"
              alt="Logo Zephy"
              className="h-8 w-8 drop-shadow-md"
            />
            <span className="text-2xl font-bold tracking-tight">Zephy</span>
          </Link>

          {/* Menú de Escritorio */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavItem key={link.name} link={link} />
            ))}
          </div>

          {/* Botón de Menú para Móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 focus:outline-none transition-transform duration-300 hover:scale-110"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú para Móvil */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-2 bg-gray-900 flex flex-col">
          {navLinks.map((link) => (
            <NavItem key={link.name} link={link} onClick={toggleMenu} />
          ))}
        </div>
      </div>
    </nav>
  );
}
