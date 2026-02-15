import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { subscribeToRequest, type TransactionRequest } from '../services/transactionStore';

interface BuyerWaitingProps {
    requestId: string;
    onApproved: (request: TransactionRequest) => void;
}

export const BuyerWaiting: React.FC<BuyerWaitingProps> = ({ requestId, onApproved }) => {
    const { t } = useTranslation();
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        // Real-time Firebase listener — fires instantly when seller approves
        const unsubscribe = subscribeToRequest(requestId, (req) => {
            if (req && req.status === 'approved' && !approved) {
                setApproved(true);
                setTimeout(() => onApproved(req), 1500);
            }
        });

        return () => unsubscribe();
    }, [requestId, onApproved, approved]);

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
            <AnimatePresence mode="wait">
                {!approved ? (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                            <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('waiting_approval_title')}</h2>
                            <p className="text-gray-500">{t('waiting_approval_subtitle')}</p>
                        </div>

                        {/* Pulsing dots animation */}
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
                ) : (
                    <motion.div
                        key="approved"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('request_approved')}</h2>
                            <p className="text-gray-500">{t('proceeding')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
