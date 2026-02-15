import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Tag, Clock, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { subscribeToRequest, type TransactionRequest } from '../services/transactionStore';

interface BuyerConfirmPriceProps {
    requestId: string;
    onConfirm: (request: TransactionRequest) => void;
    onReject: () => void;
}

export const BuyerConfirmPrice: React.FC<BuyerConfirmPriceProps> = ({ requestId, onConfirm, onReject }) => {
    const { t } = useTranslation();
    const [request, setRequest] = useState<TransactionRequest | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToRequest(requestId, (req) => {
            if (req) setRequest(req);
        });
        return () => unsubscribe();
    }, [requestId]);

    const formatPrice = (num: number) => num.toLocaleString('he-IL');

    const handleConfirm = () => {
        if (!request) return;
        setConfirmed(true);
        setTimeout(() => onConfirm(request), 1200);
    };

    // Still waiting for seller to set a price
    if (!request || request.status !== 'price_set' || !request.agreedPrice) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('waiting_price_title')}</h2>
                        <p className="text-gray-500">{t('waiting_price_subtitle')}</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-amber-400 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {!confirmed ? (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2 mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Tag className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{t('confirm_price_title')}</h2>
                            <p className="text-sm text-gray-500">{t('confirm_price_subtitle')}</p>
                        </div>

                        {/* Vehicle info */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Car className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {t(request.vehicle.make)} {t(request.vehicle.model)}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {request.vehicle.year} • {t(request.vehicle.trim)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Agreed price - prominent */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200 text-center">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('agreed_price')}</p>
                            <p className="text-4xl font-extrabold text-emerald-700">₪{formatPrice(request.agreedPrice)}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {t('market_price')}: ₪{formatPrice(request.pricing.avgPrice)}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                {t('confirm_price')}
                            </button>
                            <button
                                onClick={onReject}
                                className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-xl border-2 border-red-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-100"
                            >
                                <XCircle className="w-5 h-5" />
                                {t('reject')}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="confirmed"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('price_confirmed')}</h2>
                            <p className="text-gray-500">{t('proceeding')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
