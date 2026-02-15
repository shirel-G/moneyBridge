import React, { useState } from 'react';
import { ArrowRight, Send, CheckCircle2, Phone, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ComplaintFormProps {
    onBack: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onBack }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he' || i18n.language === 'ar';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const canSubmit = name && email && subject && message;

    const handleSubmit = () => {
        if (!canSubmit) return;
        // In production, this would send to a backend/email service
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('complaint_submitted')}</h2>
                <p className="text-gray-500 text-sm mb-6">{t('complaint_response_time')}</p>
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
                <h2 className="text-xl font-bold text-gray-900">{t('complaint_title')}</h2>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <Phone className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-blue-900">03-1234567</p>
                    <p className="text-xs text-blue-600">{t('complaint_phone_hours')}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <Mail className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-blue-900">support@moneybridge.co.il</p>
                    <p className="text-xs text-blue-600">{t('complaint_email_response')}</p>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('full_name')}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                </div>
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
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('complaint_subject')}</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                    >
                        <option value="">{t('complaint_select_subject')}</option>
                        <option value="transaction">{t('complaint_subject_transaction')}</option>
                        <option value="payment">{t('complaint_subject_payment')}</option>
                        <option value="privacy">{t('complaint_subject_privacy')}</option>
                        <option value="technical">{t('complaint_subject_technical')}</option>
                        <option value="other">{t('complaint_subject_other')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('complaint_message')}</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none h-32"
                        placeholder={t('complaint_message_placeholder')}
                    />
                </div>
            </div>

            {/* Regulatory Notice */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">{t('complaint_regulatory_notice')}</p>
                </div>
            </div>

            {/* Submit */}
            <motion.button
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${canSubmit
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <Send className="w-5 h-5" />
                {t('complaint_send')}
            </motion.button>
        </motion.div>
    );
};
