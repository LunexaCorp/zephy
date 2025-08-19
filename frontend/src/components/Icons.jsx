import {
  //Iconos para botones flotantes
  Trophy,
  Map,
  // Iconos de sensores
  Thermometer,
  Cloud,
  Wind,
  // Iconos de acciones
  X,
  Clock,
  MapPin,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Calendar,
  // Iconos de categorías
  Leaf,
  Sun,
  CloudRain,
  Home,
  Brain,
  Heart,
  // Iconos de navegación
  ChevronLeft,
  ChevronRight,
  Circle,
  // Iconos de estado
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

export const Icons = {
  // Iconos para botones flotantes
  trophy: Trophy,
  map: Map,
  // Sensores
  temperature: Thermometer,
  co2: Cloud,
  airQuality: Wind,

  // Acciones
  close: X,
  time: Clock,
  location: MapPin,
  alert: AlertCircle,
  idea: Lightbulb,
  book: BookOpen,
  calendar: Calendar,

  // Categorías
  nature: Leaf,
  sun: Sun,
  weather: CloudRain,
  home: Home,
  health: Brain,
  wellness: Heart,

  // Navegación
  prev: ChevronLeft,
  next: ChevronRight,
  dot: Circle,

  // Estados
  success: Check,
  warning: AlertTriangle,
  info: Info,
};

// Componente de icono con tamaño consistente
export const Icon = ({ name, size = 18, className = "", ...props }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icono "${name}" no encontrado`);
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};
