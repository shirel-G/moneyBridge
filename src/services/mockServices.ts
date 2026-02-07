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

// Comprehensive Israeli vehicle database with realistic license plates
const MOCK_VEHICLES: Record<string, VehicleDetails> = {
    // Toyota - Most popular in Israel
    "1234567": { plate: "1234567", make: "toyota", model: "corolla", year: 2022, trim: "hybrid_sun" },
    "2345678": { plate: "2345678", make: "toyota", model: "rav4", year: 2023, trim: "hybrid_premium" },
    "3456789": { plate: "3456789", make: "toyota", model: "yaris_cross", year: 2024, trim: "style" },
    "4567890": { plate: "4567890", make: "toyota", model: "corolla", year: 2021, trim: "sun" },
    "5678901": { plate: "5678901", make: "toyota", model: "camry", year: 2023, trim: "exclusive" },
    "6789012": { plate: "6789012", make: "toyota", model: "highlander", year: 2024, trim: "executive" },
    "11223344": { plate: "11223344", make: "toyota", model: "chr", year: 2022, trim: "dynamic" },

    // Hyundai - Very popular
    "87654321": { plate: "87654321", make: "hyundai", model: "ioniq5", year: 2024, trim: "elite" },
    "7890123": { plate: "7890123", make: "hyundai", model: "tucson", year: 2023, trim: "premium" },
    "8901234": { plate: "8901234", make: "hyundai", model: "kona", year: 2024, trim: "electric" },
    "9012345": { plate: "9012345", make: "hyundai", model: "i20", year: 2022, trim: "style" },
    "1357924": { plate: "1357924", make: "hyundai", model: "santa_fe", year: 2023, trim: "luxury" },
    "2468135": { plate: "2468135", make: "hyundai", model: "ioniq6", year: 2024, trim: "executive" },

    // Kia - Popular
    "5544332": { plate: "5544332", make: "kia", model: "sportage", year: 2025, trim: "gt_line" },
    "3692581": { plate: "3692581", make: "kia", model: "seltos", year: 2023, trim: "premium" },
    "4812345": { plate: "4812345", make: "kia", model: "picanto", year: 2022, trim: "urban" },
    "5923456": { plate: "5923456", make: "kia", model: "niro", year: 2024, trim: "electric" },
    "6034567": { plate: "6034567", make: "kia", model: "sorento", year: 2023, trim: "executive" },
    "7145678": { plate: "7145678", make: "kia", model: "ev6", year: 2024, trim: "gt_line" },

    // Mazda - Popular
    "9988776": { plate: "9988776", make: "mazda", model: "cx5", year: 2021, trim: "executive" },
    "8256789": { plate: "8256789", make: "mazda", model: "cx30", year: 2023, trim: "premium" },
    "9367890": { plate: "9367890", make: "mazda", model: "3", year: 2022, trim: "style" },
    "1478901": { plate: "1478901", make: "mazda", model: "cx60", year: 2024, trim: "homura" },
    "2589012": { plate: "2589012", make: "mazda", model: "2", year: 2021, trim: "sun" },

    // Tesla - Premium electric
    "1122334": { plate: "1122334", make: "tesla", model: "modely", year: 2023, trim: "performance" },
    "3690123": { plate: "3690123", make: "tesla", model: "model3", year: 2024, trim: "long_range" },
    "4801234": { plate: "4801234", make: "tesla", model: "modelx", year: 2023, trim: "plaid" },
    "5912345": { plate: "5912345", make: "tesla", model: "models", year: 2024, trim: "plaid" },
    "9182736": { plate: "9182736", make: "tesla", model: "model3", year: 2022, trim: "standard" },

    // BYD - Growing electric market
    "6823456": { plate: "6823456", make: "byd", model: "atto3", year: 2024, trim: "extended" },
    "7934567": { plate: "7934567", make: "byd", model: "dolphin", year: 2024, trim: "premium" },
    "8045678": { plate: "8045678", make: "byd", model: "seal", year: 2024, trim: "executive" },
    "9156789": { plate: "9156789", make: "byd", model: "han", year: 2024, trim: "luxury" },

    // MG - Popular electric
    "1267890": { plate: "1267890", make: "mg", model: "zs_ev", year: 2023, trim: "luxury" },
    "2378901": { plate: "2378901", make: "mg", model: "mg4", year: 2024, trim: "electric" },
    "3489012": { plate: "3489012", make: "mg", model: "mg5", year: 2023, trim: "executive" },
    "4590123": { plate: "4590123", make: "mg", model: "hs", year: 2024, trim: "premium" },

    // Skoda - Popular in Israel
    "5601234": { plate: "5601234", make: "skoda", model: "octavia", year: 2023, trim: "style" },
    "6712345": { plate: "6712345", make: "skoda", model: "karoq", year: 2024, trim: "ambition" },
    "7823456": { plate: "7823456", make: "skoda", model: "kodiaq", year: 2023, trim: "sportline" },
    "8934567": { plate: "8934567", make: "skoda", model: "scala", year: 2022, trim: "active" },
    "9045678": { plate: "9045678", make: "skoda", model: "enyaq", year: 2024, trim: "electric" },

    // Nissan
    "1156789": { plate: "1156789", make: "nissan", model: "qashqai", year: 2023, trim: "premium" },
    "2267890": { plate: "2267890", make: "nissan", model: "x_trail", year: 2024, trim: "tekna" },
    "3378901": { plate: "3378901", make: "nissan", model: "leaf", year: 2023, trim: "electric" },
    "4489012": { plate: "4489012", make: "nissan", model: "juke", year: 2022, trim: "n_design" },
    "5590123": { plate: "5590123", make: "nissan", model: "ariya", year: 2024, trim: "evolve" },

    // Mitsubishi
    "6601234": { plate: "6601234", make: "mitsubishi", model: "outlander", year: 2023, trim: "instyle" },
    "7712345": { plate: "7712345", make: "mitsubishi", model: "asx", year: 2022, trim: "intense" },
    "8823456": { plate: "8823456", make: "mitsubishi", model: "eclipse_cross", year: 2024, trim: "diamond" },

    // Suzuki
    "9934567": { plate: "9934567", make: "suzuki", model: "vitara", year: 2023, trim: "glx" },
    "1045678": { plate: "1045678", make: "suzuki", model: "swift", year: 2022, trim: "sport" },
    "2156789": { plate: "2156789", make: "suzuki", model: "sx4", year: 2023, trim: "premium" },
    "3267890": { plate: "3267890", make: "suzuki", model: "ignis", year: 2021, trim: "hybrid" },

    // Honda
    "4378901": { plate: "4378901", make: "honda", model: "civic", year: 2023, trim: "elegance" },
    "5489012": { plate: "5489012", make: "honda", model: "crv", year: 2024, trim: "executive" },
    "6590123": { plate: "6590123", make: "honda", model: "hrv", year: 2023, trim: "elegance" },
    "7601234": { plate: "7601234", make: "honda", model: "jazz", year: 2022, trim: "comfort" },

    // Volkswagen
    "8712345": { plate: "8712345", make: "volkswagen", model: "tiguan", year: 2023, trim: "rline" },
    "9823456": { plate: "9823456", make: "volkswagen", model: "golf", year: 2022, trim: "style" },
    "1934567": { plate: "1934567", make: "volkswagen", model: "taigo", year: 2024, trim: "rline" },
    "2045678": { plate: "2045678", make: "volkswagen", model: "id4", year: 2024, trim: "electric" },
    "3156789": { plate: "3156789", make: "volkswagen", model: "polo", year: 2021, trim: "comfortline" },

    // Seat
    "4267890": { plate: "4267890", make: "seat", model: "leon", year: 2023, trim: "fr" },
    "5378901": { plate: "5378901", make: "seat", model: "arona", year: 2022, trim: "xcellence" },
    "6489012": { plate: "6489012", make: "seat", model: "ateca", year: 2024, trim: "fr" },

    // Peugeot
    "7590123": { plate: "7590123", make: "peugeot", model: "3008", year: 2023, trim: "gt_line" },
    "8601234": { plate: "8601234", make: "peugeot", model: "2008", year: 2024, trim: "allure" },
    "9712345": { plate: "9712345", make: "peugeot", model: "208", year: 2022, trim: "active" },
    "1823456": { plate: "1823456", make: "peugeot", model: "e2008", year: 2024, trim: "electric" },

    // Renault
    "2934567": { plate: "2934567", make: "renault", model: "captur", year: 2023, trim: "intense" },
    "3045678": { plate: "3045678", make: "renault", model: "megane", year: 2024, trim: "techno" },
    "4156789": { plate: "4156789", make: "renault", model: "zoe", year: 2023, trim: "electric" },

    // Citroen
    "5267890": { plate: "5267890", make: "citroen", model: "c5_aircross", year: 2023, trim: "shine" },
    "6378901": { plate: "6378901", make: "citroen", model: "c3", year: 2022, trim: "feel" },
    "7489012": { plate: "7489012", make: "citroen", model: "ec4", year: 2024, trim: "electric" },

    // Subaru
    "8590123": { plate: "8590123", make: "subaru", model: "forester", year: 2023, trim: "premium" },
    "9601234": { plate: "9601234", make: "subaru", model: "outback", year: 2024, trim: "touring" },
    "1712345": { plate: "1712345", make: "subaru", model: "xv", year: 2022, trim: "field" },

    // Jeep
    "2823456": { plate: "2823456", make: "jeep", model: "compass", year: 2023, trim: "limited" },
    "3934567": { plate: "3934567", make: "jeep", model: "renegade", year: 2022, trim: "longitude" },
    "4045678": { plate: "4045678", make: "jeep", model: "grand_cherokee", year: 2024, trim: "summit" },

    // Ford
    "5156789": { plate: "5156789", make: "ford", model: "puma", year: 2023, trim: "st_line" },
    "6267890": { plate: "6267890", make: "ford", model: "focus", year: 2022, trim: "titanium" },
    "7378901": { plate: "7378901", make: "ford", model: "kuga", year: 2024, trim: "st_line" },

    // Opel
    "8489012": { plate: "8489012", make: "opel", model: "mokka", year: 2023, trim: "gs_line" },
    "9590123": { plate: "9590123", make: "opel", model: "corsa", year: 2024, trim: "elegance" },
    "1601234": { plate: "1601234", make: "opel", model: "grandland", year: 2023, trim: "ultimate" },

    // Volvo
    "2712345": { plate: "2712345", make: "volvo", model: "xc40", year: 2024, trim: "recharge" },
    "3823456": { plate: "3823456", make: "volvo", model: "xc60", year: 2023, trim: "inscription" },
    "4934567": { plate: "4934567", make: "volvo", model: "xc90", year: 2024, trim: "momentum" },

    // BMW
    "5045678": { plate: "5045678", make: "bmw", model: "x3", year: 2023, trim: "xdrive30i" },
    "6156789": { plate: "6156789", make: "bmw", model: "3_series", year: 2024, trim: "msport" },
    "7267890": { plate: "7267890", make: "bmw", model: "ix3", year: 2024, trim: "electric" },

    // Mercedes
    "8378901": { plate: "8378901", make: "mercedes", model: "glc", year: 2023, trim: "amg_line" },
    "9489012": { plate: "9489012", make: "mercedes", model: "c_class", year: 2024, trim: "avantgarde" },
    "1590123": { plate: "1590123", make: "mercedes", model: "eqc", year: 2024, trim: "electric" },
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
