import { useState, useCallback } from 'react';
import type { VehicleDetails, BankDetails } from '../services/mockServices';
import {
    createRequest,
    registerSeller as firebaseRegisterSeller,
    setAgreedPrice as firebaseSetAgreedPrice,
    confirmPrice as firebaseConfirmPrice,
    markPaymentComplete as firebaseMarkPaymentComplete,
    markTransferComplete as firebaseMarkTransferComplete,
    type TransactionRequest,
} from '../services/transactionStore';

export type TransactionStep =
    | 'ROLE_SELECT'
    // Buyer steps
    | 'BUYER_VEHICLE_LOOKUP'
    | 'BUYER_ENTER_SELLER'
    | 'BUYER_WAITING_APPROVAL'
    | 'BUYER_CONFIRM_PRICE'
    | 'BUYER_BANK_DETAILS'
    | 'BUYER_FINANCING'
    | 'BUYER_DEPOSIT'
    | 'BUYER_PAYMENT'
    | 'BUYER_WAITING_TRANSFER'
    // Seller steps
    | 'SELLER_REGISTER'
    | 'SELLER_PENDING_REQUESTS'
    | 'SELLER_SET_PRICE'
    | 'SELLER_WAITING_PAYMENT'
    | 'SELLER_OWNERSHIP_TRANSFER'
    // Shared
    | 'COMPLETE';

interface TransactionState {
    step: TransactionStep;
    role: 'BUYER' | 'SELLER' | null;
    vehicle: VehicleDetails | null;
    pricing: { minPrice: number; maxPrice: number; avgPrice: number } | null;
    ownerCount: number;
    mileage: number;
    price: number;
    userBank: BankDetails | null;
    buyerDetails: any | null;
    sellerDetails: any | null;
    paymentVerified: boolean;
    ownershipTransferVerified: boolean;
    // Buyer phone (from OTP step — saved for pre-fill)
    buyerPhone: string;
    // Seller-side state
    sellerPhone: string;
    sellerIdNumber: string;
    // Request tracking
    currentRequestId: string | null;
    approvedRequest: TransactionRequest | null;
}

export const useTransaction = () => {
    const [state, setState] = useState<TransactionState>({
        step: 'ROLE_SELECT',
        role: null,
        vehicle: null,
        pricing: null,
        ownerCount: 0,
        mileage: 0,
        price: 0,
        userBank: null,
        buyerDetails: null,
        sellerDetails: null,
        paymentVerified: false,
        ownershipTransferVerified: false,
        buyerPhone: '',
        sellerPhone: '',
        sellerIdNumber: '',
        currentRequestId: null,
        approvedRequest: null,
    });

    // --- Role Selection ---
    const selectRole = (role: 'BUYER' | 'SELLER') => {
        setState(prev => ({
            ...prev,
            role,
            step: role === 'BUYER' ? 'BUYER_VEHICLE_LOOKUP' : 'SELLER_REGISTER',
        }));
    };

    // --- Buyer Flow ---
    const setVehicleForBuyer = (
        vehicle: VehicleDetails,
        pricing: { minPrice: number; maxPrice: number; avgPrice: number },
        ownerCount: number,
        mileage: number
    ) => {
        setState(prev => ({
            ...prev,
            vehicle,
            pricing,
            ownerCount,
            mileage,
            price: pricing.avgPrice,
            step: 'BUYER_ENTER_SELLER',
        }));
    };

    // Save buyer phone from OTP verification
    const setBuyerPhoneVerified = (phone: string) => {
        setState(prev => ({ ...prev, buyerPhone: phone }));
    };

    const submitSellerLink = async (sellerPhone: string, sellerIdNumber: string, buyerPhone: string) => {
        if (!state.vehicle || !state.pricing) return;

        const request = await createRequest({
            buyerPhone,
            buyerName: buyerPhone,
            sellerPhone,
            sellerIdNumber,
            vehicle: state.vehicle,
            pricing: state.pricing,
            ownerCount: state.ownerCount,
            mileage: state.mileage,
        });

        setState(prev => ({
            ...prev,
            currentRequestId: request.id,
            step: 'BUYER_WAITING_APPROVAL',
        }));
    };

    // After seller approves → buyer goes to CONFIRM PRICE (wait for seller to set price)
    const onBuyerApproved = useCallback((request: TransactionRequest) => {
        setState(prev => ({
            ...prev,
            approvedRequest: request,
            currentRequestId: request.id,
            step: 'BUYER_CONFIRM_PRICE',
        }));
    }, []);

    // After buyer confirms price → go to bank details
    const buyerConfirmPrice = async (request: TransactionRequest) => {
        await firebaseConfirmPrice(request.id);
        setState(prev => ({
            ...prev,
            approvedRequest: request,
            price: request.agreedPrice || request.pricing.avgPrice,
            step: 'BUYER_BANK_DETAILS',
        }));
    };

    // After buyer fills bank details → go to financing offers
    const setBuyerDetails = (details: any) => {
        const userBank: BankDetails = {
            id: details.bankName,
            name: details.bankName,
            code: '',
            icon: ''
        };
        setState(prev => ({ ...prev, buyerDetails: details, userBank, step: 'BUYER_FINANCING' }));
    };

    // Financing → deposit
    const skipFinancing = () => {
        setState(prev => ({ ...prev, step: 'BUYER_DEPOSIT' }));
    };

    // Go to payment
    const startPayment = () => {
        setState(prev => ({ ...prev, step: 'BUYER_PAYMENT' }));
    };

    // After payment → mark in Firebase + wait for seller transfer
    const completePayment = async () => {
        if (state.currentRequestId) {
            await firebaseMarkPaymentComplete(state.currentRequestId);
        }
        setState(prev => ({
            ...prev,
            paymentVerified: true,
            step: 'BUYER_WAITING_TRANSFER',
        }));
    };

    // After seller completes transfer → buyer done
    const onTransferComplete = useCallback(() => {
        setState(prev => ({
            ...prev,
            ownershipTransferVerified: true,
            step: 'COMPLETE',
        }));
    }, []);

    // --- Seller Flow ---
    const registerSeller = async (phone: string, idNumber: string) => {
        await firebaseRegisterSeller(phone, idNumber);
        setState(prev => ({
            ...prev,
            sellerPhone: phone,
            sellerIdNumber: idNumber,
            step: 'SELLER_PENDING_REQUESTS',
        }));
    };

    // After seller approves request → go to SET PRICE (not complete!)
    const sellerApproveRequest = (request: TransactionRequest) => {
        setState(prev => ({
            ...prev,
            approvedRequest: request,
            vehicle: request.vehicle,
            pricing: request.pricing,
            currentRequestId: request.id,
            step: 'SELLER_SET_PRICE',
        }));
    };

    // Seller sets agreed price → wait for payment
    const sellerSetPrice = async (price: number) => {
        if (!state.currentRequestId) return;
        await firebaseSetAgreedPrice(state.currentRequestId, price);
        setState(prev => ({
            ...prev,
            price,
            step: 'SELLER_WAITING_PAYMENT',
        }));
    };

    // Payment received → seller does ownership transfer
    const onPaymentReceived = useCallback((_request: TransactionRequest) => {
        setState(prev => ({
            ...prev,
            step: 'SELLER_OWNERSHIP_TRANSFER',
        }));
    }, []);

    // Seller completes ownership transfer → mark in Firebase + done
    const sellerCompleteTransfer = async () => {
        if (state.currentRequestId) {
            await firebaseMarkTransferComplete(state.currentRequestId);
        }
        setState(prev => ({
            ...prev,
            ownershipTransferVerified: true,
            step: 'COMPLETE',
        }));
    };

    const reset = () => {
        setState({
            step: 'ROLE_SELECT',
            role: null,
            vehicle: null,
            pricing: null,
            ownerCount: 0,
            mileage: 0,
            price: 0,
            userBank: null,
            buyerDetails: null,
            sellerDetails: null,
            paymentVerified: false,
            ownershipTransferVerified: false,
            buyerPhone: '',
            sellerPhone: '',
            sellerIdNumber: '',
            currentRequestId: null,
            approvedRequest: null,
        });
    };

    return {
        state,
        selectRole,
        setVehicleForBuyer,
        setBuyerPhoneVerified,
        submitSellerLink,
        onBuyerApproved,
        buyerConfirmPrice,
        setBuyerDetails,
        skipFinancing,
        startPayment,
        completePayment,
        onTransferComplete,
        registerSeller,
        sellerApproveRequest,
        sellerSetPrice,
        onPaymentReceived,
        sellerCompleteTransfer,
        reset,
    };
};
