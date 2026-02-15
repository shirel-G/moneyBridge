import React, { useState } from 'react';
import { DollarSign, Car, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TransactionRequest } from '../services/transactionStore';

interface SellerSetPriceProps {
    request: TransactionRequest;
    onSubmitPrice: (price: number) => void;
}

export const SellerSetPrice: React.FC<SellerSetPriceProps> = ({ request, onSubmitPrice }) => {
    const { t } = useTranslation();
    const [priceInput, setPriceInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const price = parseInt(priceInput) || 0;
    const isValid = price >= 1000;

    const formatPrice = (num: number) => num.toLocaleString('he-IL');

    const handleSubmit = () => {
        if (!isValid) return;
        setSubmitting(true);
        setTimeout(() => onSubmitPrice(price), 400);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2 mb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('set_price_title')}</h2>
                <p className="text-sm text-gray-500">{t('set_price_subtitle')}</p>
            </div>

            {/* Vehicle summary */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">
                            {t(request.vehicle.make)} {t(request.vehicle.model)}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {request.vehicle.year} • {t(request.vehicle.trim)} • {request.vehicle.plate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Market price range reference */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('market_price_range')}</p>
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <TrendingDown className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">{t('min_price')}</p>
                        <p className="text-sm font-bold text-gray-700">₪{formatPrice(request.pricing.minPrice)}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <p className="text-xs text-green-100">{t('recommended')}</p>
                        <p className="text-lg font-bold text-white">₪{formatPrice(request.pricing.avgPrice)}</p>
                    </div>
                    <div className="text-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">{t('max_price')}</p>
                        <p className="text-sm font-bold text-gray-700">₪{formatPrice(request.pricing.maxPrice)}</p>
                    </div>
                </div>
            </div>

            {/* Price input */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {t('agreed_price')} (₪)
                </label>
                <input
                    type="tel"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-2xl font-bold text-center focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="0"
                />
                {price > 0 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        ₪{formatPrice(price)}
                    </p>
                )}
            </div>

            {/* Buyer info */}
            <div className="bg-gray-50 p-3 rounded-xl text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">{t('buyer')}</span>
                    <span className="font-medium text-gray-900">{request.buyerPhone}</span>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className={clsx(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
                    isValid && !submitting
                        ? "bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                )}
            >
                {t('send_price')}
            </button>
        </motion.div>
    );
};
