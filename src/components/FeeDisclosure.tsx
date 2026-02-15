import React from 'react';
import { AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FeeDisclosureProps {
    vehiclePrice: number;
    onAccept: () => void;
    onBack: () => void;
}

const SERVICE_FEE_PERCENT = 0.5; // 0.5% service fee
const MIN_FEE = 500; // Minimum ₪500
const MAX_FEE = 5000; // Maximum ₪5,000

export function calculateServiceFee(vehiclePrice: number): number {
    const fee = vehiclePrice * (SERVICE_FEE_PERCENT / 100);
    return Math.max(MIN_FEE, Math.min(MAX_FEE, Math.round(fee)));
}

export const FeeDisclosure: React.FC<FeeDisclosureProps> = ({
    vehiclePrice,
    onAccept,
    onBack,
}) => {
    const { t } = useTranslation();
    const fee = calculateServiceFee(vehiclePrice);
    const total = vehiclePrice + fee;

    const formatPrice = (n: number) =>
        `₪${n.toLocaleString('he-IL')}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto p-6"
        >
            {/* Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Info className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{t('fee_disclosure_title')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('fee_disclosure_subtitle')}</p>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden mb-6">
                {/* Vehicle Price */}
                <div className="flex justify-between items-center p-4 border-b border-gray-50">
                    <span className="text-gray-600">{t('fee_vehicle_price')}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(vehiclePrice)}</span>
                </div>

                {/* Service Fee */}
                <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-amber-50">
                    <div>
                        <span className="text-amber-800 font-medium">{t('fee_service_fee')}</span>
                        <span className="text-xs text-amber-600 block">
                            ({SERVICE_FEE_PERCENT}%, {t('fee_min')} {formatPrice(MIN_FEE)}, {t('fee_max')} {formatPrice(MAX_FEE)})
                        </span>
                    </div>
                    <span className="font-bold text-amber-800">{formatPrice(fee)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <span className="text-white font-bold text-lg">{t('fee_total')}</span>
                    <span className="text-white font-bold text-xl">{formatPrice(total)}</span>
                </div>
            </div>

            {/* What's included */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-3">{t('fee_included_title')}</h3>
                <ul className="space-y-2">
                    {[
                        t('fee_included_1'),
                        t('fee_included_2'),
                        t('fee_included_3'),
                        t('fee_included_4'),
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">{t('fee_cancel_title')}</h4>
                        <p className="text-xs text-blue-700">{t('fee_cancel_desc')}</p>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAccept}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                    {t('fee_accept')}
                </motion.button>
                <button
                    onClick={onBack}
                    className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
                >
                    {t('back')}
                </button>
            </div>
        </motion.div>
    );
};
