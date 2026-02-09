import React from 'react';
import { CreditCard, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface FinancingOffer {
    id: string;
    providerName: string;
    providerNameHebrew: string;
    monthlyPayment: number;
    interestRate: number;
    numPayments: number;
    totalAmount: number;
    approvalLikelihood: 'high' | 'medium';
}

interface FinancingOffersProps {
    vehiclePrice: number;
    onContinue: () => void;
    onSkip: () => void;
}

export const FinancingOffers: React.FC<FinancingOffersProps> = ({ vehiclePrice, onContinue, onSkip }) => {
    const { t } = useTranslation();

    // Generate realistic financing offers
    const offers: FinancingOffer[] = [
        {
            id: 'mimun-yashar',
            providerName: 'Direct Finance',
            providerNameHebrew: 'מימון ישיר',
            monthlyPayment: Math.round(vehiclePrice * 0.035),
            interestRate: 4.9,
            numPayments: 36,
            totalAmount: Math.round(vehiclePrice * 1.18),
            approvalLikelihood: 'high'
        },
        {
            id: 'leumi-card',
            providerName: 'Leumi Card',
            providerNameHebrew: 'לאומי קארד',
            monthlyPayment: Math.round(vehiclePrice * 0.0265),
            interestRate: 5.5,
            numPayments: 48,
            totalAmount: Math.round(vehiclePrice * 1.25),
            approvalLikelihood: 'high'
        },
        {
            id: 'isracard',
            providerName: 'Isracard',
            providerNameHebrew: 'ישראכרט',
            monthlyPayment: Math.round(vehiclePrice * 0.0285),
            interestRate: 5.2,
            numPayments: 48,
            totalAmount: Math.round(vehiclePrice * 1.22),
            approvalLikelihood: 'medium'
        },
        {
            id: 'cal',
            providerName: 'Cal',
            providerNameHebrew: 'כאל',
            monthlyPayment: Math.round(vehiclePrice * 0.0225),
            interestRate: 6.5,
            numPayments: 60,
            totalAmount: Math.round(vehiclePrice * 1.35),
            approvalLikelihood: 'high'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('financing_title')}</h2>
                <p className="text-sm text-gray-500">{t('financing_subtitle')}</p>
            </div>

            {/* Offers */}
            <div className="space-y-4">
                {offers.map((offer, index) => (
                    <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-5 rounded-2xl border-2 border-gray-200 hover:border-banking-blue hover:shadow-lg transition-all cursor-pointer active:scale-98"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{offer.providerNameHebrew}</h3>
                                <p className="text-xs text-gray-400">{offer.providerName}</p>
                            </div>
                            {offer.approvalLikelihood === 'high' && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {t('approval_high')}
                                </span>
                            )}
                            {offer.approvalLikelihood === 'medium' && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                                    {t('approval_medium')}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t('monthly_payment')}</p>
                                <p className="text-lg font-bold text-banking-blue">₪{offer.monthlyPayment.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t('num_payments')}</p>
                                <p className="text-lg font-bold text-gray-900">{offer.numPayments}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t('interest_rate')}</p>
                                <p className="text-lg font-bold text-gray-900">{offer.interestRate}%</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <div>
                                <p className="text-xs text-gray-400">{t('total_amount')}</p>
                                <p className="text-sm font-semibold text-gray-600">₪{offer.totalAmount.toLocaleString()}</p>
                            </div>
                            <CreditCard className="w-5 h-5 text-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
                <button
                    onClick={onContinue}
                    className="w-full bg-banking-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-blue-600"
                >
                    <span>{t('choose_offer')}</span>
                    <ArrowRight className="w-5 h-5" />
                </button>

                <button
                    onClick={onSkip}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                    {t('skip_financing')}
                </button>
            </div>
        </div>
    );
};
