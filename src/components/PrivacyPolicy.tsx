import React from 'react';
import { ArrowRight, Shield, Database, Eye, Trash2, Lock, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he' || i18n.language === 'ar';

    const sections = [
        {
            icon: <Database className="w-5 h-5" />,
            title: t('privacy_section_1_title'),
            content: t('privacy_section_1_content'),
        },
        {
            icon: <Eye className="w-5 h-5" />,
            title: t('privacy_section_2_title'),
            content: t('privacy_section_2_content'),
        },
        {
            icon: <Lock className="w-5 h-5" />,
            title: t('privacy_section_3_title'),
            content: t('privacy_section_3_content'),
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: t('privacy_section_4_title'),
            content: t('privacy_section_4_content'),
        },
        {
            icon: <Trash2 className="w-5 h-5" />,
            title: t('privacy_section_5_title'),
            content: t('privacy_section_5_content'),
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: t('privacy_section_6_title'),
            content: t('privacy_section_6_content'),
        },
        {
            icon: <Mail className="w-5 h-5" />,
            title: t('privacy_section_7_title'),
            content: t('privacy_section_7_content'),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
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
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{t('privacy_title')}</h2>
                    <p className="text-xs text-gray-400">{t('privacy_last_updated')}</p>
                </div>
            </div>

            {/* Intro */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-blue-800 leading-relaxed">{t('privacy_intro')}</p>
            </div>

            {/* Sections */}
            <div className="space-y-4">
                {sections.map((section, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                {section.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                ))}
            </div>

            {/* Back button */}
            <button
                onClick={onBack}
                className="w-full mt-6 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
                {t('back')}
            </button>
        </motion.div>
    );
};
