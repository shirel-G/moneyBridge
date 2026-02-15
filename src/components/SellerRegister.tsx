import React, { useState } from 'react';
import { MessageSquare, UserCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface SellerRegisterProps {
    onRegister: (phone: string, idNumber: string) => void;
}

export const SellerRegister: React.FC<SellerRegisterProps> = ({ onRegister }) => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    const isValid = phone.length >= 10 && idNumber.length === 9;

    const handleSendCode = () => {
        setShowOtp(true);
    };

    const handleOtpChange = (value: string) => {
        const clean = value.replace(/\D/g, '').slice(0, 4);
        setOtp(clean);
        if (clean.length === 4) {
            setTimeout(() => {
                onRegister(phone, idNumber);
            }, 500);
        }
    };

    if (showOtp) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                    <MessageSquare className="w-8 h-8" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('enter_verification_code')}</h2>
                    <p className="text-gray-500">
                        {t('code_sent_to')} <span className="font-semibold text-gray-900">{phone}</span>
                    </p>
                </div>

                <div className="relative">
                    <div className="flex justify-center gap-3 my-6">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="w-12 h-14 border-2 rounded-xl flex items-center justify-center text-2xl font-bold border-gray-200 bg-gray-50 text-gray-900">
                                {otp[i] || ''}
                            </div>
                        ))}
                    </div>

                    <input
                        type="tel"
                        autoFocus
                        value={otp}
                        onChange={(e) => handleOtpChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        maxLength={4}
                        placeholder="____"
                    />
                </div>

                <p className="text-sm text-gray-400">{t('enter_any_code')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('seller_register_title')}</h2>
                <p className="text-sm text-gray-500">{t('seller_register_subtitle')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('phone_number')}</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="050-1234567"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('id_number')}</label>
                    <input
                        type="tel"
                        maxLength={9}
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="123456789"
                    />
                </div>
            </div>

            <button
                onClick={handleSendCode}
                disabled={!isValid}
                className={clsx(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95",
                    isValid
                        ? "bg-emerald-600 text-white shadow-emerald-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                )}
            >
                {t('next')}
            </button>
        </div>
    );
};
