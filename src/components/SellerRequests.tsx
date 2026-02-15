import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Car, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    subscribeToSellerRequests,
    approveRequest,
    rejectRequest,
    type TransactionRequest,
} from '../services/transactionStore';

interface SellerRequestsProps {
    sellerPhone: string;
    sellerIdNumber: string;
    onApprove: (request: TransactionRequest) => void;
}

export const SellerRequests: React.FC<SellerRequestsProps> = ({
    sellerPhone,
    sellerIdNumber,
    onApprove,
}) => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<TransactionRequest[]>([]);

    useEffect(() => {
        // Real-time Firebase listener — fires instantly when buyer creates a request
        const unsubscribe = subscribeToSellerRequests(sellerPhone, sellerIdNumber, (reqs) => {
            setRequests(reqs);
        });

        return () => unsubscribe();
    }, [sellerPhone, sellerIdNumber]);

    const pendingRequests = requests.filter((r) => r.status === 'pending');

    const handleApprove = async (req: TransactionRequest) => {
        await approveRequest(req.id);
        onApprove({ ...req, status: 'approved' });
    };

    const handleReject = async (req: TransactionRequest) => {
        await rejectRequest(req.id);
    };

    const formatPrice = (num: number) => num.toLocaleString('he-IL');

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('pending_requests_title')}</h2>
                <p className="text-sm text-gray-500">{t('pending_requests_subtitle')}</p>
            </div>

            <AnimatePresence>
                {pendingRequests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 space-y-4"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <Clock className="w-8 h-8 text-gray-400 animate-pulse" />
                        </div>
                        <p className="text-gray-400 font-medium">{t('no_requests_yet')}</p>
                        <p className="text-gray-300 text-sm">{t('waiting_for_buyer')}</p>

                        {/* Pulsing animation */}
                        <div className="flex justify-center gap-2 pt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2.5 h-2.5 bg-emerald-300 rounded-full"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    pendingRequests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-md space-y-4"
                        >
                            {/* Vehicle Info */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <Car className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {t(req.vehicle.make)} {t(req.vehicle.model)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {req.vehicle.year} • {t(req.vehicle.trim)} • {req.vehicle.plate}
                                    </p>
                                </div>
                            </div>

                            {/* Pricing Info */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">{t('min_price')}</p>
                                        <p className="text-sm font-bold text-gray-700">₪{formatPrice(req.pricing.minPrice)}</p>
                                    </div>
                                    <div className="text-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                        <p className="text-xs text-green-100">{t('recommended')}</p>
                                        <p className="text-lg font-bold text-white">₪{formatPrice(req.pricing.avgPrice)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">{t('max_price')}</p>
                                        <p className="text-sm font-bold text-gray-700">₪{formatPrice(req.pricing.maxPrice)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Buyer Info */}
                            <div className="bg-gray-50 p-3 rounded-xl text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">{t('buyer')}</span>
                                    <span className="font-medium text-gray-900">{req.buyerPhone}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleApprove(req)}
                                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-emerald-700"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    {t('approve')}
                                </button>
                                <button
                                    onClick={() => handleReject(req)}
                                    className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl border-2 border-red-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-100"
                                >
                                    <XCircle className="w-5 h-5" />
                                    {t('reject')}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
