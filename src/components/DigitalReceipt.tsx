import React, { useRef } from 'react';
import { Download, FileText, CheckCircle2, Car, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface DigitalReceiptProps {
    transactionData: {
        vehicle: { make: string; model: string; year: number; licensePlate?: string };
        price: number;
        role: 'BUYER' | 'SELLER';
        buyerName?: string;
        sellerName?: string;
        transactionId?: string;
    };
    onBack: () => void;
}

export const DigitalReceipt: React.FC<DigitalReceiptProps> = ({ transactionData, onBack }) => {
    const { t } = useTranslation();
    const receiptRef = useRef<HTMLDivElement>(null);

    const serviceFee = Math.max(500, Math.min(5000, Math.round(transactionData.price * 0.005)));
    const total = transactionData.price + serviceFee;
    const receiptNumber = transactionData.transactionId || `MB-${Date.now().toString(36).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString('he-IL', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const formatPrice = (n: number) => `₪${n.toLocaleString('he-IL')}`;

    const handleDownload = () => {
        // Generate a text-based receipt for download
        const receiptText = `
═══════════════════════════════════════
       MONEY BRIDGE - קבלה דיגיטלית
═══════════════════════════════════════

מספר קבלה: ${receiptNumber}
תאריך: ${dateStr}

───────────────────────────────────────
פרטי העסקה
───────────────────────────────────────
רכב: ${t(transactionData.vehicle.make)} ${t(transactionData.vehicle.model)} ${transactionData.vehicle.year}
${transactionData.vehicle.licensePlate ? `לוחית: ${transactionData.vehicle.licensePlate}` : ''}

מחיר הרכב:        ${formatPrice(transactionData.price)}
עמלת שירות (0.5%): ${formatPrice(serviceFee)}
───────────────────────────────────────
סה"כ:              ${formatPrice(total)}
───────────────────────────────────────

סטטוס: ✓ העסקה הושלמה בהצלחה
${transactionData.buyerName ? `קונה: ${transactionData.buyerName}` : ''}
${transactionData.sellerName ? `מוכר: ${transactionData.sellerName}` : ''}

═══════════════════════════════════════
Money Bridge Ltd. | support@moneybridge.co.il
רישיון שירותי תשלום מס׳ XXXX | ISA
═══════════════════════════════════════
        `.trim();

        const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MoneyBridge_Receipt_${receiptNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto p-6"
        >
            {/* Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{t('receipt_title')}</h2>
                <p className="text-sm text-gray-500">{t('receipt_subtitle')}</p>
            </div>

            {/* Receipt Card */}
            <div ref={receiptRef} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
                {/* Receipt Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white text-center">
                    <p className="text-xs opacity-80">Money Bridge</p>
                    <p className="font-bold text-lg">{t('receipt_title')}</p>
                    <p className="text-xs opacity-70 mt-1">{receiptNumber}</p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50 bg-gray-50">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{dateStr}</span>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                            {t(transactionData.vehicle.make)} {t(transactionData.vehicle.model)} {transactionData.vehicle.year}
                        </p>
                        {transactionData.vehicle.licensePlate && (
                            <p className="text-xs text-gray-500">{transactionData.vehicle.licensePlate}</p>
                        )}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="px-4 py-3 border-b border-gray-50">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">{t('fee_vehicle_price')}</span>
                        <span className="font-medium">{formatPrice(transactionData.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">{t('fee_service_fee')} (0.5%)</span>
                        <span className="font-medium text-amber-600">{formatPrice(serviceFee)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-50">
                    <span className="font-bold text-green-900">{t('fee_total')}</span>
                    <span className="font-bold text-xl text-green-700">{formatPrice(total)}</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 px-4 py-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-700">{t('receipt_status_complete')}</span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <Shield className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{t('receipt_secured')}</span>
                </div>
            </div>

            {/* Download Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
                <Download className="w-5 h-5" />
                {t('receipt_download')}
            </motion.button>

            <button
                onClick={onBack}
                className="w-full mt-3 py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
            >
                {t('back')}
            </button>
        </motion.div>
    );
};
