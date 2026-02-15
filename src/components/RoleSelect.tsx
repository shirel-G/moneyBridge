import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RoleSelectProps {
    onSelectRole: (role: 'BUYER' | 'SELLER') => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ onSelectRole }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div className="text-center py-6">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    {t('welcome')}
                </h2>
                <p className="text-gray-500 text-lg">{t('select_role_subtitle')}</p>
            </div>

            <div className="space-y-4">
                {/* Buyer Card */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => onSelectRole('BUYER')}
                    className="w-full bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl shadow-xl shadow-blue-200 text-white text-right active:scale-95 transition-transform"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <ShoppingCart className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{t('i_am_buyer')}</h3>
                            <p className="text-blue-100 text-sm">{t('buyer_desc')}</p>
                        </div>
                    </div>
                </motion.button>

                {/* Seller Card */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => onSelectRole('SELLER')}
                    className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl shadow-xl shadow-emerald-200 text-white text-right active:scale-95 transition-transform"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Store className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{t('i_am_seller')}</h3>
                            <p className="text-emerald-100 text-sm">{t('seller_desc')}</p>
                        </div>
                    </div>
                </motion.button>
            </div>
        </div>
    );
};
