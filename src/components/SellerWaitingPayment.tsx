import React, { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { subscribeToRequest, type TransactionRequest } from '../services/transactionStore';

interface SellerWaitingPaymentProps {
    requestId: string;
    onPaymentReceived: (request: TransactionRequest) => void;
}

export const SellerWaitingPayment: React.FC<SellerWaitingPaymentProps> = ({ requestId, onPaymentReceived }) => {
    const { t } = useTranslation();
    const [paid, setPaid] = useState(false);
    const [request, setRequest] = useState<TransactionRequest | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToRequest(requestId, (req) => {
            if (req) {
                setRequest(req);
                if (req.paymentComplete && !paid) {
                    setPaid(true);
                    setTimeout(() => onPaymentReceived(req), 1500);
                }
            }
        });
        return () => unsubscribe();
    }, [requestId, onPaymentReceived, paid]);

    const formatPrice = (num: number) => num.toLocaleString('he-IL');

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
            <AnimatePresence mode="wait">
                {!paid ? (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <CreditCard className="w-10 h-10 text-blue-600 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('waiting_payment_title')}</h2>
                            <p className="text-gray-500">{t('waiting_payment_subtitle')}</p>
                        </div>

                        {request?.agreedPrice && (
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                                <p className="text-xs text-gray-500 mb-1">{t('agreed_price')}</p>
                                <p className="text-2xl font-extrabold text-emerald-700">₪{formatPrice(request.agreedPrice)}</p>
                            </div>
                        )}

                        <div className="flex justify-center gap-2 pt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 bg-blue-400 rounded-full"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="paid"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('payment_confirmed')}</h2>
                            <p className="text-gray-500">{t('proceeding')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
