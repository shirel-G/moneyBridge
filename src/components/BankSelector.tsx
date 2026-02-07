import React from 'react';
import { ISRAELI_BANKS, type BankDetails } from '../services/mockServices';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface BankSelectorProps {
    onSelect: (bank: BankDetails) => void;
    selectedBankId?: string;
}

export const BankSelector: React.FC<BankSelectorProps> = ({ onSelect, selectedBankId }) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-2 gap-4">
            {ISRAELI_BANKS.map((bank) => (
                <button
                    key={bank.id}
                    onClick={() => onSelect(bank)}
                    className={clsx(
                        "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden",
                        selectedBankId === bank.id
                            ? "border-banking-blue bg-blue-50/50 shadow-md transform scale-[1.02]"
                            : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
                    )}
                >
                    <div className="h-16 w-32 mb-4 flex items-center justify-center">
                        <img
                            src={bank.icon}
                            alt={bank.name}
                            className={clsx(
                                "max-h-full max-w-full object-contain transition-all duration-300",
                                selectedBankId === bank.id ? "grayscale-0" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                            )}
                        />
                    </div>
                    {/* Translate bank name using dynamic key construction */}
                    <span className="font-medium text-gray-900 text-sm">{t(`bank_${bank.id}`)}</span>
                </button>
            ))}
        </div>
    );
};
