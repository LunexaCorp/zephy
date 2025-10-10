import {
  Trophy,
  Map,
  Thermometer,
  Cloud,
  Wind,
  Droplets,
  X,
  Clock,
  MapPin,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Calendar,
  Leaf,
  Sun,
  CloudRain,
  Home,
  Brain,
  Heart,
  ChevronLeft,
  ChevronRight,
  Circle,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

export const Icons = {
  trophy: Trophy,
  map: Map,
  temperature: Thermometer,
  co2: Cloud,
  airQuality: Wind,
  humidity: Droplets,
  close: X,
  time: Clock,
  location: MapPin,
  alert: AlertCircle,
  idea: Lightbulb,
  book: BookOpen,
  calendar: Calendar,
  nature: Leaf,
  sun: Sun,
  weather: CloudRain,
  home: Home,
  health: Brain,
  wellness: Heart,
  prev: ChevronLeft,
  next: ChevronRight,
  dot: Circle,
  success: Check,
  warning: AlertTriangle,
  info: Info,
};

export const Icon = ({ name, size = 18, className = "", ...props }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return null;
  }
  return <IconComponent size={size} className={className} {...props} />;
};
