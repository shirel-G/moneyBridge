import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OwnershipTransferProps {
    onComplete: () => void;
}

export const OwnershipTransfer: React.FC<OwnershipTransferProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [verifying, setVerifying] = useState(false);
    const [complete, setComplete] = useState(false);

    const handleVerify = () => {
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            setComplete(true);
            setTimeout(onComplete, 1500); // Auto proceed after success
        }, 4000); // Simulate MoT API call
    };

    if (complete) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center space-y-4"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('ownership_transferred')}</h2>
                <p className="text-gray-500">{t('vehicle_belongs')}</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8 text-center p-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6 relative">
                <Building2 className="w-10 h-10 text-gray-500" />
                {verifying && (
                    <div className="absolute inset-0 border-4 border-banking-blue rounded-full border-t-transparent animate-spin"></div>
                )}
            </div>

            <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">{t('gov_verification')}</h2>
                <p className="text-gray-500 max-w-xs mx-auto">
                    {t('connect_mot')}
                </p>
            </div>

            <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
                {verifying ? t('verifying_mot') : t('verify_btn')}
            </button>
        </div>
    );
};
