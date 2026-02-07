import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { simulateIAPPayment } from '../services/mockServices';
import { ShieldCheck, Lock, Server, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentSimulatorProps {
    onComplete: () => void;
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);

    const STEPS = [
        { text: t('step_connecting'), icon: Server, color: "text-blue-500" },
        { text: t('step_verifying'), icon: ShieldCheck, color: "text-purple-500" },
        { text: t('step_securing'), icon: Lock, color: "text-amber-500" },
        { text: t('step_finalizing'), icon: Banknote, color: "text-green-500" }
    ];

    useEffect(() => {
        // Total duration ~20s
        const stepDuration = 5000;

        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, stepDuration);

        simulateIAPPayment().then(() => {
            clearInterval(interval);
            onComplete();
        });

        return () => clearInterval(interval);
    }, [onComplete]);

    const StepIcon = STEPS[currentStep].icon;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl">
            <motion.div
                key={currentStep}
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center p-8 max-w-sm"
            >
                <div className="relative w-32 h-32 mb-8">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 border-4 border-banking-blue/20 rounded-full"></div>

                    {/* Spinner */}
                    <div className="absolute inset-0 border-4 border-banking-blue rounded-full border-t-transparent animate-spin"></div>

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <StepIcon className={`w-12 h-12 ${STEPS[currentStep].color}`} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('processing')}</h2>
                <p className="text-lg text-gray-600 font-medium min-h-[3rem]">
                    {STEPS[currentStep].text}
                </p>

                <div className="w-full bg-gray-100 h-2 rounded-full mt-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-banking-blue"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </motion.div>
        </div>
    );
};
