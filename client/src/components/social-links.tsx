import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'email' | 'phone' | 'location';
  url: string;
  label: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const defaultLinks: SocialLink[] = [
  { platform: 'facebook', url: 'https://facebook.com/domrealce', label: 'Facebook' },
  { platform: 'instagram', url: 'https://instagram.com/domrealce', label: 'Instagram' },
  { platform: 'linkedin', url: 'https://linkedin.com/company/domrealce', label: 'LinkedIn' },
  { platform: 'phone', url: 'tel:+351300000000', label: '+351 300 000 000' },
  { platform: 'email', url: 'mailto:info@domrealce.pt', label: 'info@domrealce.pt' }
];

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  email: Mail,
  phone: Phone,
  location: MapPin
};

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

const buttonSizeMap = {
  sm: 'p-1.5',
  md: 'p-2.5',
  lg: 'p-3'
};

export default function SocialLinks({ 
  links = defaultLinks, 
  orientation = 'horizontal', 
  size = 'md',
  showLabels = false 
}: SocialLinksProps) {
  const containerClass = orientation === 'horizontal' 
    ? 'flex gap-3 flex-wrap justify-center items-center'
    : 'flex flex-col gap-2 items-start';

  return (
    <div className={containerClass} data-testid="social-links">
      {links.map((link) => {
        const Icon = iconMap[link.platform];
        return (
          <a
            key={link.platform}
            href={link.url}
            target={link.platform !== 'phone' && link.platform !== 'email' ? '_blank' : undefined}
            rel={link.platform !== 'phone' && link.platform !== 'email' ? 'noopener noreferrer' : undefined}
            className="group transition-all duration-300"
            data-testid={`social-link-${link.platform}`}
            aria-label={link.label}
          >
            {showLabels ? (
              <Button
                variant="outline"
                className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black gap-2"
              >
                <Icon className={sizeMap[size]} />
                <span className="text-sm">{link.label}</span>
              </Button>
            ) : (
              <button
                className={`${buttonSizeMap[size]} rounded-lg border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition-all duration-300 flex items-center justify-center`}
              >
                <Icon className={sizeMap[size]} />
              </button>
            )}
          </a>
        );
      })}
    </div>
  );
}
