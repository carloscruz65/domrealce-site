import { Shield, Zap, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CredibilityBadge {
  id: string;
  icon: 'shield' | 'zap' | 'award' | 'check';
  title: string;
  description: string;
  color?: 'yellow' | 'turquoise' | 'red' | 'green';
}

interface CredibilityBadgesProps {
  badges?: CredibilityBadge[];
  layout?: 'grid' | 'horizontal';
}

const defaultBadges: CredibilityBadge[] = [
  {
    id: '1',
    icon: 'check',
    title: 'Certificado ISO',
    description: 'Qualidade garantida com certificação ISO 9001',
    color: 'green'
  },
  {
    id: '2',
    icon: 'shield',
    title: 'Pagamento Seguro',
    description: 'Transações 100% seguras com SSL/TLS',
    color: 'turquoise'
  },
  {
    id: '3',
    icon: 'award',
    title: 'Prémios',
    description: 'Galardoado por excelência em Design',
    color: 'yellow'
  },
  {
    id: '4',
    icon: 'zap',
    title: 'Entrega Rápida',
    description: 'Envio em 24-48h em Portugal',
    color: 'red'
  }
];

const iconMap = {
  shield: Shield,
  zap: Zap,
  award: Award,
  check: CheckCircle
};

const colorMap = {
  yellow: 'text-brand-yellow',
  turquoise: 'text-brand-turquoise',
  red: 'text-brand-red',
  green: 'text-brand-green'
};

export default function CredibilityBadges({ badges = defaultBadges, layout = 'grid' }: CredibilityBadgesProps) {
  const containerClass = layout === 'grid'
    ? 'grid md:grid-cols-2 lg:grid-cols-4 gap-6'
    : 'flex gap-6 flex-wrap justify-center';

  return (
    <div className={containerClass} data-testid="credibility-badges">
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon];
        const colorClass = colorMap[badge.color || 'yellow'];
        
        return (
          <Card
            key={badge.id}
            className="bg-gray-900/50 border-gray-800 hover:border-brand-yellow/30 transition-all duration-300"
            data-testid={`badge-${badge.id}`}
          >
            <CardContent className="p-6 text-center">
              <Icon className={`w-10 h-10 ${colorClass} mx-auto mb-3`} />
              <h3 className="font-semibold text-white mb-2 text-lg" data-testid={`badge-title-${badge.id}`}>
                {badge.title}
              </h3>
              <p className="text-gray-400 text-sm" data-testid={`badge-description-${badge.id}`}>
                {badge.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
