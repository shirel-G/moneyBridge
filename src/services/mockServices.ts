export interface VehicleDetails {
    plate: string;
    make: string;
    model: string;
    year: number;
    trim: string;
}

export interface BankDetails {
    id: string;
    name: string;
    code: string;
    icon: string; // URL or name
}

const MOCK_VEHICLES: Record<string, VehicleDetails> = {
    "1234567": { plate: "1234567", make: "toyota", model: "corolla", year: 2022, trim: "hybrid_sun" },
    "87654321": { plate: "87654321", make: "hyundai", model: "ioniq5", year: 2024, trim: "elite" },
    "1122334": { plate: "1122334", make: "tesla", model: "modely", year: 2023, trim: "performance" },
    "5544332": { plate: "5544332", make: "kia", model: "sportage", year: 2025, trim: "gt_line" },
    "9988776": { plate: "9988776", make: "mazda", model: "cx5", year: 2021, trim: "executive" },
};

export const fetchVehicleDetails = async (plate: string): Promise<VehicleDetails | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return specific mock if exists
            if (MOCK_VEHICLES[plate]) {
                resolve(MOCK_VEHICLES[plate]);
                return;
            }

            // Deterministic generation based on last digit for consistent "random" results
            const lastDigit = parseInt(plate.slice(-1));
            const makes = ["toyota", "hyundai", "kia", "mazda", "skoda", "tesla", "byd", "mitsubishi", "suzuki", "honda"];
            const models = ["corolla", "tucson", "sportage", "cx5", "octavia", "model3", "atto3", "outlander", "swift", "civic"];
            const trims = ["sun", "style", "premium", "exclusive", "pure", "tech", "urban"];

            resolve({
                plate,
                make: makes[lastDigit % makes.length],
                model: models[lastDigit % models.length],
                year: 2018 + (lastDigit % 8), // 2018-2025
                trim: trims[lastDigit % trims.length]
            });
        }, 1200); // Slightly longer realistic delay
    });
};

import leumiLogo from '../assets/logos/leumi.png';
import hapoalimLogo from '../assets/logos/hapoalim.png';
import discountLogo from '../assets/logos/discount.png';
import mizrahiLogo from '../assets/logos/mizrahi.png';
import yahavLogo from '../assets/logos/yahav.png';
import fibiLogo from '../assets/logos/fibi.png';

export const ISRAELI_BANKS: BankDetails[] = [
    { id: 'leumi', name: 'Leumi', code: '10', icon: leumiLogo },
    { id: 'hapoalim', name: 'Hapoalim', code: '12', icon: hapoalimLogo },
    { id: 'discount', name: 'Discount', code: '11', icon: discountLogo },
    { id: 'mizrahi', name: 'Mizrahi Tefahot', code: '20', icon: mizrahiLogo },
    { id: 'yahav', name: 'Yahav', code: '04', icon: yahavLogo },
    { id: 'poagi', name: 'First International', code: '31', icon: fibiLogo },
];

export const getEscrowAccount = (bankId: string) => {
    // Returns the Money Bridge Trust account for the *same* bank for instant transfer
    const bank = ISRAELI_BANKS.find(b => b.id === bankId);
    return {
        bankName: bank?.name || 'Unknown',
        branch: '800',
        accountNumber: '88776655',
        accountName: 'Money Bridge Trust Ltd.',
    };
};

export const simulateIAPPayment = async (): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 20000); // 20 seconds simulation as requested
    });
};
