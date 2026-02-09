import { useState } from 'react';
import type { VehicleDetails, BankDetails } from '../services/mockServices';

export type TransactionStep =
    | 'SETUP'
    | 'VEHICLE_LOOKUP'
    | 'SELLER_DETAILS'
    | 'BUYER_DETAILS'
    | 'DEPOSIT_INSTRUCTIONS'
    | 'PAYMENT_SIMULATION'
    | 'FINANCING_OFFERS'
    | 'INSURANCE_OFFERS'
    | 'OWNERSHIP_TRANSFER'
    | 'COMPLETE';

interface TransactionState {
    step: TransactionStep;
    role: 'BUYER' | 'SELLER';
    vehicle: VehicleDetails | null;
    price: number;
    userBank: BankDetails | null;
    buyerDetails: any | null;
    sellerDetails: any | null;
    paymentVerified: boolean;
    ownershipTransferVerified: boolean;
}

export const useTransaction = () => {
    const [state, setState] = useState<TransactionState>({
        step: 'VEHICLE_LOOKUP',
        role: 'BUYER', // Defaulting to buyer for this demo
        vehicle: null,
        price: 0,
        userBank: null, // This is the bank selected for payment (Buyer's source)
        buyerDetails: null,
        sellerDetails: null, // Includes target bank account
        paymentVerified: false,
        ownershipTransferVerified: false,
    });

    const setVehicle = (vehicle: VehicleDetails, price: number) => {
        setState(prev => ({ ...prev, vehicle, price, step: 'SELLER_DETAILS' }));
    };

    const setSellerDetails = (details: any) => {
        setState(prev => ({ ...prev, sellerDetails: details, step: 'BUYER_DETAILS' }));
    }

    const setBuyerDetails = (details: any) => {
        // Extract bank info from buyer details (since they provide it in the form)
        const userBank: BankDetails = {
            id: details.bankName,
            name: details.bankName,
            code: '',
            icon: ''
        };
        setState(prev => ({ ...prev, buyerDetails: details, userBank, step: 'DEPOSIT_INSTRUCTIONS' }));
    }

    const startPayment = () => {
        setState(prev => ({ ...prev, step: 'PAYMENT_SIMULATION' }));
    };

    const completePayment = () => {
        setState(prev => ({ ...prev, paymentVerified: true, step: 'FINANCING_OFFERS' }));
    };

    const skipFinancing = () => {
        setState(prev => ({ ...prev, step: 'INSURANCE_OFFERS' }));
    };

    const skipInsurance = () => {
        setState(prev => ({ ...prev, step: 'OWNERSHIP_TRANSFER' }));
    }

    const completeOwnershipTransfer = () => {
        setState(prev => ({ ...prev, ownershipTransferVerified: true, step: 'COMPLETE' }));
    };

    const reset = () => {
        setState({
            step: 'VEHICLE_LOOKUP',
            role: 'BUYER',
            vehicle: null,
            price: 0,
            userBank: null,
            buyerDetails: null,
            sellerDetails: null,
            paymentVerified: false,
            ownershipTransferVerified: false,
        })
    }

    return {
        state,
        setVehicle,
        setSellerDetails,
        setBuyerDetails,
        startPayment,
        completePayment,
        skipFinancing,
        skipInsurance,
        completeOwnershipTransfer,
        reset
    };
};
