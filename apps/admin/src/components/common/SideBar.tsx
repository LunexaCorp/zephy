"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  MapPinIcon,
  CpuChipIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {Sigma} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/" },
  { name: "Dispositivos", icon: CpuChipIcon, path: "/devices" },
  { name: "Localidades", icon: MapPinIcon, path: "/locations" },
  { name: "Configuración", icon: Sigma, path: "/environmental-config" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // En desktop expandido por defecto, en mobile/tablet colapsado
      if (!mobile && !open) {
        setOpen(true);
      } else if (mobile && open) {
        setOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Cerrar sidebar en mobile al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <>
      {/* Botón hamburguesa para mobile */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 bg-sky-900 text-white p-2 rounded-lg shadow-lg lg:hidden"
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: open ? 240 : isMobile ? 0 : 80,
          x: isMobile && !open ? -240 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          bg-gradient-to-b from-sky-900 to-sky-800 text-white
          flex flex-col h-screen shadow-xl
          ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}
        `}
      >
        {/* Header con logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img
              src="/zephy.svg"
              alt="Logo Zephy"
              className={`transition-all duration-300 ${
                open ? "w-10 h-10" : "w-8 h-8 mx-auto"
              }`}
            />
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold tracking-wide"
              >
                Zephy
              </motion.span>
            )}
          </div>

          {/* Botón colapsar solo en desktop */}
          {!isMobile && (
            <button
              onClick={() => setOpen(!open)}
              className="text-white/70 hover:text-white transition"
            >
              {open ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Menú */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    active
                      ? "bg-white/20 shadow-inner"
                      : "hover:bg-white/10 hover:shadow"
                  }`}
                >
                  <Icon className="h-6 w-6 text-white flex-shrink-0" />
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium text-white whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition">
            <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm whitespace-nowrap"
              >
                Cerrar sesión
              </motion.span>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
