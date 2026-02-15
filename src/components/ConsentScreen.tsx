import React, { useState } from 'react';
import { Shield, FileText, Eye, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { logConsent } from '../services/auditLog';

interface ConsentScreenProps {
    onAccept: () => void;
    onViewPrivacy: () => void;
    onViewTerms: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
    onAccept,
    onViewPrivacy,
    onViewTerms,
}) => {
    const { t } = useTranslation();
    const [consents, setConsents] = useState({
        dataCollection: false,
        termsOfService: false,
        privacyPolicy: false,
    });

    const allAccepted = consents.dataCollection && consents.termsOfService && consents.privacyPolicy;

    const handleAccept = async () => {
        if (!allAccepted) return;
        // Log consent to audit trail
        await logConsent(true, ['data_collection', 'terms_of_service', 'privacy_policy']);
        // Save consent timestamp locally
        localStorage.setItem('mb_consent', JSON.stringify({
            granted: true,
            timestamp: new Date().toISOString(),
            version: '1.0',
            types: ['data_collection', 'terms_of_service', 'privacy_policy'],
        }));
        onAccept();
    };

    const toggleConsent = (key: keyof typeof consents) => {
        setConsents(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto p-6"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('consent_title')}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{t('consent_subtitle')}</p>
            </div>

            {/* Data Collection Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('consent_data_title')}
                </h3>
                <ul className="space-y-2 text-sm text-blue-800" dir="auto">
                    <li className="flex items-start gap-2">
                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {t('consent_data_1')}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {t('consent_data_2')}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {t('consent_data_3')}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {t('consent_data_4')}
                    </li>
                </ul>
            </div>

            {/* Security Note */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t('consent_security_title')}
                </h3>
                <p className="text-sm text-green-800">{t('consent_security_desc')}</p>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3 mb-8">
                {/* Data Collection */}
                <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                    <input
                        type="checkbox"
                        checked={consents.dataCollection}
                        onChange={() => toggleConsent('dataCollection')}
                        className="mt-0.5 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{t('consent_check_data')}</span>
                </label>

                {/* Terms of Service */}
                <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                    <input
                        type="checkbox"
                        checked={consents.termsOfService}
                        onChange={() => toggleConsent('termsOfService')}
                        className="mt-0.5 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                        {t('consent_check_terms')}
                        <button
                            onClick={(e) => { e.preventDefault(); onViewTerms(); }}
                            className="text-blue-600 underline mx-1 hover:text-blue-800"
                        >
                            {t('consent_view_terms')}
                        </button>
                    </span>
                </label>

                {/* Privacy Policy */}
                <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                    <input
                        type="checkbox"
                        checked={consents.privacyPolicy}
                        onChange={() => toggleConsent('privacyPolicy')}
                        className="mt-0.5 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                        {t('consent_check_privacy')}
                        <button
                            onClick={(e) => { e.preventDefault(); onViewPrivacy(); }}
                            className="text-blue-600 underline mx-1 hover:text-blue-800"
                        >
                            {t('consent_view_privacy')}
                        </button>
                    </span>
                </label>
            </div>

            {/* Accept Button */}
            <motion.button
                whileHover={allAccepted ? { scale: 1.02 } : {}}
                whileTap={allAccepted ? { scale: 0.98 } : {}}
                onClick={handleAccept}
                disabled={!allAccepted}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${allAccepted
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5" />
                    {t('consent_accept')}
                </div>
            </motion.button>

            {/* Version info */}
            <p className="text-center text-xs text-gray-400 mt-4">
                {t('consent_version')}
            </p>
        </motion.div>
    );
};
