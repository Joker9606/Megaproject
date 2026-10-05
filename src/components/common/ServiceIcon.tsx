import React from 'react';
import {
  Zap,
  Wrench,
  Sparkles,
  Hammer,
  Wind,
  GraduationCap,
  HeartHandshake,
  Cpu,
  Key,
  Flame,
  Paintbrush,
  Bug,
  Home,
  Layers,
  Baby,
  Dog,
  Music,
  Car,
  Sparkle,
  Trees,
  Truck,
  Monitor,
  Camera,
  Sun,
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Tag
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export function ServiceIcon({ name, className = 'w-6 h-6' }: ServiceIconProps) {
  switch (name.toLowerCase()) {
    case 'zap':
    case 'electrician':
      return <Zap className={className} />;
    case 'wrench':
    case 'plumber':
      return <Wrench className={className} />;
    case 'sparkles':
    case 'cleaning':
      return <Sparkles className={className} />;
    case 'hammer':
    case 'carpenter':
      return <Hammer className={className} />;
    case 'wind':
    case 'ac repair':
    case 'ac-repair':
      return <Wind className={className} />;
    case 'cpu':
    case 'appliance repair':
    case 'appliance-repair':
      return <Cpu className={className} />;
    case 'key':
    case 'locksmith':
      return <Key className={className} />;
    case 'flame':
    case 'welder':
      return <Flame className={className} />;
    case 'paintbrush':
    case 'painter':
      return <Paintbrush className={className} />;
    case 'bug':
    case 'pest-control':
      return <Bug className={className} />;
    case 'home':
    case 'roofer':
      return <Home className={className} />;
    case 'layers':
    case 'flooring':
      return <Layers className={className} />;
    case 'hearthandshake':
    case 'caregiver':
      return <HeartHandshake className={className} />;
    case 'baby':
    case 'childcare':
      return <Baby className={className} />;
    case 'dog':
    case 'pet-care':
      return <Dog className={className} />;
    case 'graduationcap':
    case 'tutor':
      return <GraduationCap className={className} />;
    case 'music':
    case 'language-tutor':
      return <Music className={className} />;
    case 'car':
    case 'mechanic':
      return <Car className={className} />;
    case 'sparkle':
    case 'car-detailing':
      return <Sparkle className={className} />;
    case 'trees':
    case 'gardener':
      return <Trees className={className} />;
    case 'truck':
    case 'mover':
      return <Truck className={className} />;
    case 'monitor':
    case 'tech-support':
      return <Monitor className={className} />;
    case 'camera':
    case 'cctv-smart-home':
      return <Camera className={className} />;
    case 'sun':
    case 'solar':
      return <Sun className={className} />;
    case 'shield':
    case 'shieldcheck':
      return <ShieldCheck className={className} />;
    case 'map':
    case 'mappin':
      return <MapPin className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'tag':
      return <Tag className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
