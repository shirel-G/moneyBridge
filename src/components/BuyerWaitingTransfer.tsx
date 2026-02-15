import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { subscribeToRequest } from '../services/transactionStore';

interface BuyerWaitingTransferProps {
    requestId: string;
    onTransferComplete: () => void;
}

export const BuyerWaitingTransfer: React.FC<BuyerWaitingTransferProps> = ({ requestId, onTransferComplete }) => {
    const { t } = useTranslation();
    const [transferred, setTransferred] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToRequest(requestId, (req) => {
            if (req && req.transferComplete && !transferred) {
                setTransferred(true);
                setTimeout(() => onTransferComplete(), 1500);
            }
        });
        return () => unsubscribe();
    }, [requestId, onTransferComplete, transferred]);

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
            <AnimatePresence mode="wait">
                {!transferred ? (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-10 h-10 text-purple-600 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('waiting_transfer_title')}</h2>
                            <p className="text-gray-500">{t('waiting_transfer_subtitle')}</p>
                        </div>

                        <div className="flex justify-center gap-2 pt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 bg-purple-400 rounded-full"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="transferred"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('transfer_confirmed')}</h2>
                            <p className="text-gray-500">{t('proceeding')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
