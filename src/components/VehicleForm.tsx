import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CheckCircle } from 'lucide-react';
import { fetchVehicleDetails, type VehicleDetails } from '../services/mockServices';
import { useTranslation } from 'react-i18next';

interface VehicleFormProps {
    onVehicleVerified: (vehicle: VehicleDetails, price: number) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ onVehicleVerified }) => {
    const { t } = useTranslation();
    const [plate, setPlate] = useState('');
    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
    const [_, setError] = useState<string | null>(null);

    const [price, setPrice] = useState('');

    useEffect(() => {
        const checkPlate = async () => {
            if (plate.length >= 7 && plate.length <= 8) {
                setLoading(true);
                setError(null);
                try {
                    const details = await fetchVehicleDetails(plate);
                    if (details) {
                        setVehicle(details);
                    } else {
                        // Fallback - should ideally never happen with current mock logic
                        const generated = {
                            plate,
                            make: "toyota",
                            model: "corolla",
                            year: 2026,
                            trim: "sun"
                        }
                        setVehicle(generated);
                    }
                } catch (err) {
                    setError("Failed to fetch vehicle");
                } finally {
                    setLoading(false);
                }
            } else {
                setVehicle(null);
            }
        };

        const timeout = setTimeout(checkPlate, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [plate]);

    const handleContinue = () => {
        if (vehicle && price) {
            onVehicleVerified(vehicle, parseInt(price));
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('license_plate')}</label>
                <div className="relative">
                    <input
                        type="number"
                        className="block w-full text-center text-3xl font-bold tracking-widest p-4 rounded-xl border-2 border-gray-200 focus:border-banking-blue focus:ring-0 outline-none transition-all placeholder-gray-300 bg-gray-50"
                        placeholder="1234567"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value.slice(0, 8))}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {loading ? <div className="animate-spin w-5 h-5 border-2 border-banking-blue border-t-transparent rounded-full" /> : <Car className="w-6 h-6" />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {vehicle && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-md border border-blue-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Car className="w-24 h-24 text-banking-blue" />
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-full">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-800">{t('verified_vehicle')}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {t(vehicle.make)} {t(vehicle.model)}
                        </h3>
                        <p className="text-gray-500 text-lg">{vehicle.year} • {t(vehicle.trim)}</p>

                        <div className="mt-6 pt-6 border-t border-blue-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('sale_price')} (₪)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="block w-full text-xl font-medium p-3 rounded-xl border border-gray-200 focus:border-banking-blue outline-none transition-all placeholder-gray-300"
                                placeholder="0"
                            />
                        </div>

                        <button
                            onClick={handleContinue}
                            disabled={!price}
                            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95 ${price ? 'bg-banking-blue text-white shadow-blue-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            {t('continue')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
