import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface InsuranceOffer {
    id: string;
    provider: string;
    logo: string;
    compulsory: number;
    comprehensive: number;
}

import harelLogo from '../assets/logos/harel.png';
import phoenixLogo from '../assets/logos/phoenix.png';
import menoraLogo from '../assets/logos/menora.png';

const OFFERS: InsuranceOffer[] = [
    { id: 'harel', provider: 'Harel', logo: harelLogo, compulsory: 1200, comprehensive: 3500 },
    { id: 'phoenix', provider: 'Phoenix', logo: phoenixLogo, compulsory: 1150, comprehensive: 3400 },
    { id: 'menora', provider: 'Menora', logo: menoraLogo, compulsory: 1250, comprehensive: 3600 },
];

interface InsuranceOffersProps {
    onContinue: () => void;
}

export const InsuranceOffers: React.FC<InsuranceOffersProps> = ({ onContinue }) => {
    const { t } = useTranslation();
    const [selected, setSelected] = React.useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{t('protect_ride')}</h2>
                <p className="text-gray-500">{t('exclusive_rates')}</p>
            </div>

            <div className="space-y-4">
                {OFFERS.map((offer) => (
                    <button
                        key={offer.id}
                        onClick={() => setSelected(offer.id)}
                        className={clsx(
                            "w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden group",
                            selected === offer.id
                                ? "border-banking-blue bg-blue-50"
                                : "border-gray-100 bg-white hover:border-gray-200"
                        )}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-10 flex items-center justify-center">
                                    <img
                                        src={offer.logo}
                                        alt={offer.provider}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            </div>
                            {selected === offer.id && (
                                <div className="bg-banking-blue text-white p-1 rounded-full">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="space-y-1">
                                <div className="text-gray-500">{t('compulsory')}</div>
                                <div className="font-semibold">₪{offer.compulsory}</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200 mx-4" />
                            <div className="space-y-1 text-right">
                                <div className="text-gray-500">{t('comprehensive')}</div>
                                <div className="font-semibold">₪{offer.comprehensive}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <button onClick={onContinue} className="w-full py-4 text-banking-blue font-medium hover:bg-blue-50 rounded-xl transition-colors">
                {t('skip')}
            </button>
        </div>
    );
};
