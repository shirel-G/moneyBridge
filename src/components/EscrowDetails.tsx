import React, { useEffect, useState } from 'react';
import { getEscrowAccount, type BankDetails } from '../services/mockServices';
import { Copy, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface EscrowDetailsProps {
    userBank: BankDetails;
    price: number;
    onDetect?: () => void;
}

export const EscrowDetails: React.FC<EscrowDetailsProps> = ({ userBank, price, onDetect }) => {
    const { t } = useTranslation();
    const escrowAccount = getEscrowAccount(userBank.id);
    const [timeLeft, setTimeLeft] = useState(25); // Increased time slightly for effect
    const SERVICE_FEE = 120;
    const total = price + SERVICE_FEE;

    // Get translated bank name for the account info
    const translatedBankName = t(`bank_${userBank.id}`);

    useEffect(() => {
        if (!onDetect) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onDetect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onDetect]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 text-banking-blue mb-2">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="font-semibold text-lg">{t('deposit_title')}</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <h4 className="font-semibold text-gray-700 mb-2">{t('payment_breakdown')}</h4>
                <div className="flex justify-between">
                    <span className="text-gray-500">{t('sale_price')}</span>
                    <span className="font-medium">₪{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">{t('service_fee')}</span>
                    <span className="font-medium">₪{SERVICE_FEE}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="font-bold text-gray-900">{t('total_to_transfer')}</span>
                    <span className="font-bold text-banking-blue text-lg">₪{total.toLocaleString()}</span>
                </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-blue-200/50 pb-2">
                    <span className="text-gray-500 text-sm">Bank</span>
                    <span className="font-medium text-gray-900">{translatedBankName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200/50 pb-2">
                    <span className="text-gray-500 text-sm">Branch</span>
                    <span className="font-medium text-gray-900">{escrowAccount.branch}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Account</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg text-gray-900 tracking-wide">{escrowAccount.accountNumber}</span>
                        <button className="text-banking-blue hover:text-blue-700">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
                Beneficiary: {escrowAccount.accountName}
            </p>

            {/* Payment Detection Simulation */}
            <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{t('listening_transaction')}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{timeLeft}s</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-banking-blue"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 25, ease: "linear" }}
                    />
                </div>
                <p className="text-xs text-center text-gray-400 mt-2 whitespace-pre-line">
                    {t('transfer_funds_msg')}
                </p>
            </div>
        </div>
    );
};
