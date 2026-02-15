import React, { useState } from 'react';
import { ArrowRight, Trash2, Eye, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { writeAuditLog } from '../services/auditLog';

interface DataAccessPageProps {
    onBack: () => void;
}

export const DataAccessPage: React.FC<DataAccessPageProps> = ({ onBack }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he' || i18n.language === 'ar';
    const [requestType, setRequestType] = useState<'access' | 'delete' | null>(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!requestType || !email || !phone) return;

        await writeAuditLog(
            requestType === 'access' ? 'DATA_ACCESS_REQUESTED' : 'DATA_DELETION_REQUESTED',
            { role: 'buyer' },
            { email, requestType, reason: reason || 'none' }
        );

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto p-6 text-center"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('data_request_submitted')}</h2>
                <p className="text-gray-500 text-sm mb-6">{t('data_request_response_time')}</p>
                <button
                    onClick={onBack}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                    {t('back')}
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto p-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <ArrowRight className={`w-5 h-5 text-gray-600 ${isRTL ? '' : 'rotate-180'}`} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">{t('data_access_title')}</h2>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-blue-800">{t('data_access_intro')}</p>
            </div>

            {/* Request Type */}
            <div className="space-y-3 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('data_request_type')}</label>

                <button
                    onClick={() => setRequestType('access')}
                    className={`w-full p-4 rounded-xl border-2 text-right flex items-center gap-3 transition-all ${requestType === 'access' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                        }`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${requestType === 'access' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                        <Eye className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{t('data_request_access')}</div>
                        <div className="text-xs text-gray-500">{t('data_request_access_desc')}</div>
                    </div>
                </button>

                <button
                    onClick={() => setRequestType('delete')}
                    className={`w-full p-4 rounded-xl border-2 text-right flex items-center gap-3 transition-all ${requestType === 'delete' ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-red-200'
                        }`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${requestType === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{t('data_request_delete')}</div>
                        <div className="text-xs text-gray-500">{t('data_request_delete_desc')}</div>
                    </div>
                </button>
            </div>

            {/* Warning for delete */}
            {requestType === 'delete' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">{t('data_delete_warning')}</p>
                    </div>
                </div>
            )}

            {/* Contact Details */}
            {requestType && (
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('phone_number')}</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="050-1234567"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('data_request_reason')}</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none h-24"
                            placeholder={t('data_request_reason_placeholder')}
                        />
                    </div>
                </div>
            )}

            {/* Submit */}
            {requestType && (
                <motion.button
                    whileHover={email && phone ? { scale: 1.02 } : {}}
                    whileTap={email && phone ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                    disabled={!email || !phone}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${email && phone
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <Send className="w-5 h-5" />
                    {t('data_request_submit')}
                </motion.button>
            )}
        </motion.div>
    );
};
