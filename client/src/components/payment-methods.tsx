import { CreditCard, DollarSign, Smartphone } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: 'card' | 'mbway' | 'multibanco' | 'payshop' | 'other';
  description?: string;
}

interface PaymentMethodsProps {
  methods?: PaymentMethod[];
  layout?: 'compact' | 'detailed';
}

const defaultMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Cartão de Crédito',
    icon: 'card',
    description: 'Visa, Mastercard, American Express'
  },
  {
    id: '2',
    name: 'MB Way',
    icon: 'mbway',
    description: 'Pagamento por telemóvel seguro'
  },
  {
    id: '3',
    name: 'Multibanco',
    icon: 'multibanco',
    description: 'Referência Multibanco'
  },
  {
    id: '4',
    name: 'Payshop',
    icon: 'payshop',
    description: 'Rede Payshop'
  }
];

const iconMap = {
  card: CreditCard,
  mbway: Smartphone,
  multibanco: DollarSign,
  payshop: DollarSign,
  other: CreditCard
};

export default function PaymentMethods({ methods = defaultMethods, layout = 'compact' }: PaymentMethodsProps) {
  return (
    <div data-testid="payment-methods">
      {layout === 'compact' ? (
        <div className="flex gap-2 flex-wrap justify-center items-center" data-testid="payment-methods-compact">
          {methods.map((method) => {
            const Icon = iconMap[method.icon];
            return (
              <div
                key={method.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700"
                data-testid={`payment-method-${method.id}`}
              >
                <Icon className="w-4 h-4 text-brand-yellow" />
                <span>{method.name}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="payment-methods-detailed">
          {methods.map((method) => {
            const Icon = iconMap[method.icon];
            return (
              <div
                key={method.id}
                className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center hover:border-brand-yellow/30 transition-all"
                data-testid={`payment-method-${method.id}`}
              >
                <Icon className="w-6 h-6 text-brand-yellow mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">{method.name}</h4>
                {method.description && (
                  <p className="text-gray-400 text-xs">{method.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
