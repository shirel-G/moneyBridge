import React, { useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface UserDetails {
    fullName: string;
    idNumber: string;
    phoneNumber: string;
    bankName: string;
    branch: string;
    accountNumber: string;
}

interface UserDetailsFormProps {
    role: 'BUYER' | 'SELLER';
    onSubmit: (details: UserDetails) => void;
    prefillPhone?: string;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ role, onSubmit, prefillPhone }) => {
    const { t } = useTranslation();
    const [details, setDetails] = useState<UserDetails>({
        fullName: '',
        idNumber: '',
        phoneNumber: prefillPhone || '',
        bankName: '',
        branch: '',
        accountNumber: ''
    });

    const handleChange = (field: keyof UserDetails, value: string) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (isValid) {
            onSubmit(details);
        }
    };

    const isValid =
        details.fullName.length > 2 &&
        details.idNumber.length === 9 &&
        details.phoneNumber.length >= 10 &&
        details.bankName &&
        details.branch.length >= 2 &&
        details.accountNumber.length >= 6;

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {role === 'BUYER' ? t('setup_buyer') : t('setup_seller')}
                </h2>
                <p className="text-sm text-gray-500">{t('verify_identity_bank')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                {/* Personal Details */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('full_name')}</label>
                    <input
                        type="text"
                        value={details.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-banking-blue focus:outline-none transition-colors"
                        placeholder="שם מלא"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('id_number')}</label>
                        <input
                            type="tel"
                            maxLength={9}
                            value={details.idNumber}
                            onChange={(e) => handleChange('idNumber', e.target.value.replace(/\D/g, ''))}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-banking-blue focus:outline-none transition-colors"
                            placeholder="123456789"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('phone_number')}</label>
                        <input
                            type="tel"
                            value={details.phoneNumber}
                            onChange={prefillPhone ? undefined : (e) => handleChange('phoneNumber', e.target.value)}
                            readOnly={!!prefillPhone}
                            className={clsx(
                                "w-full p-3 border-2 rounded-xl transition-colors",
                                prefillPhone
                                    ? "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    : "border-gray-200 focus:border-banking-blue focus:outline-none"
                            )}
                            placeholder="050-1234567"
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-200 my-4" />

                {/* Bank Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">פרטי בנק</h3>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('bank_name')}</label>
                        <select
                            value={details.bankName}
                            onChange={(e) => handleChange('bankName', e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-banking-blue focus:outline-none transition-colors"
                        >
                            <option value="">{t('select_bank')}</option>
                            <option value="leumi">{t('bank_leumi')}</option>
                            <option value="hapoalim">{t('bank_hapoalim')}</option>
                            <option value="discount">{t('bank_discount')}</option>
                            <option value="mizrahi">{t('bank_mizrahi')}</option>
                            <option value="yahav">{t('bank_yahav')}</option>
                            <option value="poagi">{t('bank_poagi')}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('branch')}</label>
                            <input
                                type="tel"
                                value={details.branch}
                                onChange={(e) => handleChange('branch', e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-banking-blue focus:outline-none transition-colors"
                                placeholder="123"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('account_number')}</label>
                            <input
                                type="tel"
                                value={details.accountNumber}
                                onChange={(e) => handleChange('accountNumber', e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-banking-blue focus:outline-none transition-colors"
                                placeholder="123456"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={clsx(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95",
                    isValid
                        ? "bg-banking-blue text-white shadow-blue-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                )}
            >
                {t('next')}
            </button>
        </div>
    );
};
