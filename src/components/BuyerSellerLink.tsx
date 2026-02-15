import React, { useState } from 'react';
import { UserSearch, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface BuyerSellerLinkProps {
    onSubmit: (sellerPhone: string, sellerIdNumber: string) => void;
}

export const BuyerSellerLink: React.FC<BuyerSellerLinkProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [sellerPhone, setSellerPhone] = useState('');
    const [sellerIdNumber, setSellerIdNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isValid = sellerPhone.length >= 10 && sellerIdNumber.length === 9;

    const handleSubmit = () => {
        if (!isValid) return;
        setSubmitting(true);
        setTimeout(() => {
            onSubmit(sellerPhone, sellerIdNumber);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserSearch className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('link_seller_title')}</h2>
                <p className="text-sm text-gray-500">{t('link_seller_subtitle')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('seller_phone')}</label>
                    <input
                        type="tel"
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="050-1234567"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('seller_id')}</label>
                    <input
                        type="tel"
                        maxLength={9}
                        value={sellerIdNumber}
                        onChange={(e) => setSellerIdNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="123456789"
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className={clsx(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
                    isValid && !submitting
                        ? "bg-banking-blue text-white shadow-blue-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                )}
            >
                {submitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('processing')}
                    </>
                ) : (
                    t('send_request')
                )}
            </button>
        </div>
    );
};
