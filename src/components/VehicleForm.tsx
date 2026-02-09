import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CheckCircle, Gauge, Users, TrendingUp, Info } from 'lucide-react';
import { fetchVehicleDetails, type VehicleDetails } from '../services/mockServices';
import { useTranslation } from 'react-i18next';

interface VehicleFormProps {
    onVehicleVerified: (vehicle: VehicleDetails, price: number) => void;
}

// Base prices by make (in ILS)
const BASE_PRICES: Record<string, number> = {
    toyota: 180000, hyundai: 160000, kia: 155000, mazda: 165000, skoda: 145000,
    tesla: 280000, byd: 170000, mitsubishi: 140000, suzuki: 130000, honda: 170000,
    mg: 150000, nissan: 155000, volkswagen: 175000, seat: 150000, peugeot: 145000,
    renault: 135000, citroen: 130000, subaru: 180000, jeep: 200000, ford: 165000,
    opel: 140000, volvo: 250000, bmw: 300000, mercedes: 320000
};

// Model multipliers
const MODEL_MULTIPLIERS: Record<string, number> = {
    corolla: 1.0, rav4: 1.3, camry: 1.4, highlander: 1.6, modely: 1.5, model3: 1.3,
    ioniq5: 1.4, ioniq6: 1.5, tucson: 1.2, sportage: 1.2, cx5: 1.25, cx60: 1.4,
    octavia: 1.1, kodiaq: 1.3, x3: 1.3, glc: 1.4, xc60: 1.35, xc90: 1.6
};

// Calculate Levi Yitzchak style price
const calculateLeviYitzchakPrice = (
    vehicle: VehicleDetails,
    ownerCount: number,
    mileage: number
): { minPrice: number; maxPrice: number; avgPrice: number } => {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicle.year;

    // Base price
    let basePrice = BASE_PRICES[vehicle.make] || 150000;

    // Apply model multiplier
    const modelMultiplier = MODEL_MULTIPLIERS[vehicle.model] || 1.0;
    basePrice *= modelMultiplier;

    // Age depreciation (roughly 10% per year, but decreasing rate)
    const ageDepreciation = Math.pow(0.88, vehicleAge);
    basePrice *= ageDepreciation;

    // Mileage adjustment (average 15,000 km/year expected)
    const expectedMileage = vehicleAge * 15000;
    const mileageDiff = mileage - expectedMileage;
    const mileageAdjustment = 1 - (mileageDiff / 100000) * 0.1; // 10% per 100k km difference
    basePrice *= Math.max(0.7, Math.min(1.15, mileageAdjustment));

    // Owner count adjustment
    const ownerAdjustment = ownerCount === 1 ? 1.05 :
        ownerCount === 2 ? 1.0 :
            ownerCount === 3 ? 0.95 : 0.90;
    basePrice *= ownerAdjustment;

    // Calculate range
    const avgPrice = Math.round(basePrice / 1000) * 1000;
    const minPrice = Math.round((avgPrice * 0.92) / 1000) * 1000;
    const maxPrice = Math.round((avgPrice * 1.08) / 1000) * 1000;

    return { minPrice, maxPrice, avgPrice };
};

export const VehicleForm: React.FC<VehicleFormProps> = ({ onVehicleVerified }) => {
    const { t } = useTranslation();
    const [plate, setPlate] = useState('');
    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
    const [_, setError] = useState<string | null>(null);

    // New fields
    const [ownerCount, setOwnerCount] = useState<number>(0);
    const [mileage, setMileage] = useState<string>('');
    const [showPricing, setShowPricing] = useState(false);
    const [loadingPrice, setLoadingPrice] = useState(false);

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
                setOwnerCount(0);
                setMileage('');
                setShowPricing(false);
            }
        };

        const timeout = setTimeout(checkPlate, 500);
        return () => clearTimeout(timeout);
    }, [plate]);

    // Calculate pricing when all details are filled
    const pricing = useMemo(() => {
        if (vehicle && ownerCount > 0 && mileage) {
            return calculateLeviYitzchakPrice(vehicle, ownerCount, parseInt(mileage));
        }
        return null;
    }, [vehicle, ownerCount, mileage]);

    // Show pricing animation when all fields are filled
    useEffect(() => {
        if (vehicle && ownerCount > 0 && mileage && !showPricing) {
            setLoadingPrice(true);
            const timer = setTimeout(() => {
                setLoadingPrice(false);
                setShowPricing(true);
                // Auto-fill average price as suggestion
                if (pricing) {
                    setPrice(pricing.avgPrice.toString());
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [vehicle, ownerCount, mileage, pricing]);

    const handleContinue = () => {
        if (vehicle && price) {
            onVehicleVerified(vehicle, parseInt(price));
        }
    };

    const formatPrice = (num: number) => {
        return num.toLocaleString('he-IL');
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

                        {/* Owner Count & Mileage Section */}
                        <div className="mt-6 pt-6 border-t border-blue-100 space-y-5">
                            {/* Owner Count (יד) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Users className="w-4 h-4" />
                                    {t('owner_count')}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => {
                                                setOwnerCount(num);
                                                setShowPricing(false);
                                            }}
                                            className={`py-3 px-4 rounded-xl font-bold text-lg transition-all ${ownerCount === num
                                                    ? 'bg-banking-blue text-white shadow-lg shadow-blue-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {t('hand')} {num === 4 ? '4+' : num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mileage (ק״מ) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Gauge className="w-4 h-4" />
                                    {t('mileage')} (ק״מ)
                                </label>
                                <input
                                    type="number"
                                    value={mileage}
                                    onChange={(e) => {
                                        setMileage(e.target.value);
                                        setShowPricing(false);
                                    }}
                                    className="block w-full text-xl font-medium p-3 rounded-xl border border-gray-200 focus:border-banking-blue outline-none transition-all placeholder-gray-300"
                                    placeholder="50000"
                                />
                            </div>
                        </div>

                        {/* Loading Price Animation */}
                        <AnimatePresence>
                            {loadingPrice && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-blue-100"
                                >
                                    <div className="flex items-center justify-center gap-3 py-8">
                                        <div className="animate-spin w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full" />
                                        <span className="text-gray-600 font-medium">{t('calculating_price')}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Levi Yitzchak Style Price Display */}
                        <AnimatePresence>
                            {showPricing && pricing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-6"
                                >
                                    {/* Price Header */}
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl p-4 flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                        <h4 className="text-white font-bold text-lg">{t('market_price')}</h4>
                                        <div className="mr-auto bg-white/20 px-3 py-1 rounded-full">
                                            <span className="text-white text-sm font-medium">{t('levi_yitzchak_style')}</span>
                                        </div>
                                    </div>

                                    {/* Price Content */}
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-b-xl p-5 border-x border-b border-amber-200">
                                        {/* Price Range */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 mb-1">{t('min_price')}</p>
                                                <p className="text-xl font-bold text-gray-700">₪{formatPrice(pricing.minPrice)}</p>
                                            </div>
                                            <div className="text-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg shadow-green-200">
                                                <p className="text-xs text-green-100 mb-1">{t('recommended')}</p>
                                                <p className="text-2xl font-bold text-white">₪{formatPrice(pricing.avgPrice)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 mb-1">{t('max_price')}</p>
                                                <p className="text-xl font-bold text-gray-700">₪{formatPrice(pricing.maxPrice)}</p>
                                            </div>
                                        </div>

                                        {/* Price Factors */}
                                        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-100 rounded-lg p-3">
                                            <Info className="w-4 h-4 flex-shrink-0" />
                                            <span>{t('price_based_on')}: {t('hand')} {ownerCount}, {formatPrice(parseInt(mileage))} ק״מ, {t('year')} {vehicle.year}</span>
                                        </div>
                                    </div>

                                    {/* Sale Price Input */}
                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('your_sale_price')} (₪)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="block w-full text-xl font-medium p-3 rounded-xl border-2 border-green-300 focus:border-green-500 outline-none transition-all bg-green-50"
                                            placeholder={pricing.avgPrice.toString()}
                                        />
                                        {price && parseInt(price) > pricing.maxPrice && (
                                            <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
                                                <Info className="w-4 h-4" />
                                                {t('price_above_market')}
                                            </p>
                                        )}
                                        {price && parseInt(price) < pricing.minPrice && (
                                            <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                                                <Info className="w-4 h-4" />
                                                {t('price_below_market')}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleContinue}
                            disabled={!price || !showPricing}
                            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95 ${price && showPricing ? 'bg-banking-blue text-white shadow-blue-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            {t('continue')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
