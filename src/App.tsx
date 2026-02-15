import { useState } from 'react';
import { Layout } from './components/Layout';
import { RoleSelect } from './components/RoleSelect';
import { VehicleForm } from './components/VehicleForm';
import { BuyerSellerLink } from './components/BuyerSellerLink';
import { BuyerWaiting } from './components/BuyerWaiting';
import { BuyerConfirmPrice } from './components/BuyerConfirmPrice';
import { BuyerWaitingTransfer } from './components/BuyerWaitingTransfer';
import { SellerRegister } from './components/SellerRegister';
import { SellerRequests } from './components/SellerRequests';
import { SellerSetPrice } from './components/SellerSetPrice';
import { SellerWaitingPayment } from './components/SellerWaitingPayment';
import { UserDetailsForm } from './components/UserDetailsForm';
import { EscrowDetails } from './components/EscrowDetails';
import { PaymentSimulator } from './components/PaymentSimulator';
import { FinancingOffers } from './components/FinancingOffers';
import { OwnershipTransfer } from './components/OwnershipTransfer';
import { ConsentScreen } from './components/ConsentScreen';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { DataAccessPage } from './components/DataAccessPage';
import { ComplaintForm } from './components/ComplaintForm';
import { DigitalReceipt } from './components/DigitalReceipt';
import { useTransaction } from './hooks/useTransaction';
import { CheckCircle2, MessageSquare, Shield, FileText, Database, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

function App() {
  const { t } = useTranslation();

  // Consent state — must be accepted before any data collection
  const [hasConsent, setHasConsent] = useState(() => {
    const saved = localStorage.getItem('mb_consent');
    return saved ? JSON.parse(saved).granted === true : false;
  });
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDataAccess, setShowDataAccess] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Buyer phone verification state (local to App — stored once, reused)
  const [buyerPhoneInput, setBuyerPhoneInput] = useState('');
  const [showBuyerOtp, setShowBuyerOtp] = useState(false);
  const [buyerOtp, setBuyerOtp] = useState('');

  const {
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
  } = useTransaction();

  const getTitle = () => {
    switch (state.step) {
      case 'ROLE_SELECT': return t('welcome');
      case 'BUYER_VEHICLE_LOOKUP': return t('vehicle_lookup_title');
      case 'BUYER_ENTER_SELLER': return t('link_seller_title');
      case 'BUYER_WAITING_APPROVAL': return t('waiting_approval_title');
      case 'BUYER_CONFIRM_PRICE': return t('confirm_price_title');
      case 'BUYER_BANK_DETAILS': return t('setup_buyer');
      case 'BUYER_FINANCING': return t('financing_title');
      case 'BUYER_DEPOSIT': return t('deposit_title');
      case 'BUYER_PAYMENT': return t('payment_title');
      case 'BUYER_WAITING_TRANSFER': return t('waiting_transfer_title');
      case 'SELLER_REGISTER': return t('seller_register_title');
      case 'SELLER_PENDING_REQUESTS': return t('pending_requests_title');
      case 'SELLER_SET_PRICE': return t('set_price_title');
      case 'SELLER_WAITING_PAYMENT': return t('waiting_payment_title');
      case 'SELLER_OWNERSHIP_TRANSFER': return t('ownership_transfer');
      case 'COMPLETE': return t('success_title');
      default: return "Money Bridge";
    }
  };

  const handleBack = () => {
    setBuyerPhoneInput('');
    setShowBuyerOtp(false);
    setBuyerOtp('');
    reset();
  };

  // Handle buyer phone OTP flow
  const handleBuyerPhoneSendCode = () => {
    if (buyerPhoneInput.length >= 10) {
      setShowBuyerOtp(true);
    }
  };

  const handleBuyerOtpChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    setBuyerOtp(clean);
    if (clean.length === 4) {
      setTimeout(() => {
        setBuyerPhoneVerified(buyerPhoneInput);
      }, 500);
    }
  };

  const renderActionButton = () => {
    switch (state.step) {
      case 'BUYER_DEPOSIT':
        return (
          <button
            onClick={startPayment}
            className="w-full bg-banking-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-blue-600"
          >
            <span>{t('confirm')} & {t('deposit_title')}</span>
          </button>
        );
      case 'COMPLETE':
        return (
          <button
            onClick={handleBack}
            className="w-full bg-gray-100 text-gray-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            {t('start_new')}
          </button>
        );
      default:
        return null;
    }
  };

  // ===== Privacy Policy Overlay =====
  if (showPrivacy) {
    return (
      <Layout title={t('privacy_title')}>
        <PrivacyPolicy onBack={() => setShowPrivacy(false)} />
      </Layout>
    );
  }

  // ===== Terms of Service Overlay =====
  if (showTerms) {
    return (
      <Layout title={t('tos_title')}>
        <TermsOfService onBack={() => setShowTerms(false)} />
      </Layout>
    );
  }

  // ===== Data Access Page Overlay =====
  if (showDataAccess) {
    return (
      <Layout title={t('data_access_title')}>
        <DataAccessPage onBack={() => setShowDataAccess(false)} />
      </Layout>
    );
  }

  // ===== Complaint Form Overlay =====
  if (showComplaint) {
    return (
      <Layout title={t('complaint_title')}>
        <ComplaintForm onBack={() => setShowComplaint(false)} />
      </Layout>
    );
  }

  // ===== Digital Receipt Overlay =====
  if (showReceipt && state.vehicle) {
    return (
      <Layout title={t('receipt_title')}>
        <DigitalReceipt
          transactionData={{
            vehicle: state.vehicle,
            price: state.price,
            role: state.role as 'BUYER' | 'SELLER',
          }}
          onBack={() => setShowReceipt(false)}
        />
      </Layout>
    );
  }

  // ===== Consent Screen — shown before any data collection =====
  if (!hasConsent) {
    return (
      <Layout title={t('consent_title')}>
        <ConsentScreen
          onAccept={() => setHasConsent(true)}
          onViewPrivacy={() => setShowPrivacy(true)}
          onViewTerms={() => setShowTerms(true)}
        />
      </Layout>
    );
  }

  return (
    <Layout
      title={getTitle()}
      actionButton={renderActionButton()}
      onBack={state.step !== 'ROLE_SELECT' && state.step !== 'COMPLETE' ? handleBack : undefined}
    >
      {/* ===== ROLE SELECTION ===== */}
      {state.step === 'ROLE_SELECT' && (
        <RoleSelect onSelectRole={selectRole} />
      )}

      {/* ===== BUYER FLOW ===== */}

      {/* 1. Vehicle lookup */}
      {state.step === 'BUYER_VEHICLE_LOOKUP' && (
        <div className="space-y-6">
          <div className="text-center py-4">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">{t('buyer_vehicle_title')}</h2>
            <p className="text-gray-500">{t('buyer_vehicle_subtitle')}</p>
          </div>
          <VehicleForm
            buyerMode={true}
            onVehicleVerified={() => { }}
            onBuyerContinue={setVehicleForBuyer}
          />
        </div>
      )}

      {/* 2. Phone OTP + Link Seller */}
      {state.step === 'BUYER_ENTER_SELLER' && (
        <div className="space-y-6">
          {/* Vehicle summary */}
          {state.vehicle && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t('vehicle')}</span>
                <span className="font-bold text-gray-900">
                  {t(state.vehicle.make)} {t(state.vehicle.model)} • {state.vehicle.year}
                </span>
              </div>
              {state.pricing && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500">{t('market_price')}</span>
                  <span className="font-bold text-blue-600">₪{state.pricing.avgPrice.toLocaleString('he-IL')}</span>
                </div>
              )}
            </div>
          )}

          {/* Phone verification → then seller link form */}
          {!state.buyerPhone ? (
            <>
              {!showBuyerOtp ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{t('enter_your_phone')}</h2>
                    <p className="text-sm text-gray-500">{t('buyer_phone_desc')}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('phone_number')}</label>
                    <input
                      type="tel"
                      id="buyer-phone-input"
                      value={buyerPhoneInput}
                      onChange={(e) => setBuyerPhoneInput(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="050-1234567"
                    />
                  </div>
                  <button
                    onClick={handleBuyerPhoneSendCode}
                    disabled={buyerPhoneInput.length < 10}
                    className={clsx(
                      "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95",
                      buyerPhoneInput.length >= 10
                        ? "bg-banking-blue text-white shadow-blue-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    )}
                  >
                    {t('verify_phone')}
                  </button>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('enter_verification_code')}</h2>
                    <p className="text-gray-500">
                      {t('code_sent_to')} <span className="font-semibold text-gray-900">{buyerPhoneInput}</span>
                    </p>
                  </div>
                  <div className="relative">
                    <div className="flex justify-center gap-3 my-6">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="w-12 h-14 border-2 rounded-xl flex items-center justify-center text-2xl font-bold border-gray-200 bg-gray-50 text-gray-900">
                          {buyerOtp[i] || ''}
                        </div>
                      ))}
                    </div>
                    <input
                      type="tel"
                      autoFocus
                      value={buyerOtp}
                      onChange={(e) => handleBuyerOtpChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      maxLength={4}
                      placeholder="____"
                    />
                  </div>
                  <p className="text-sm text-gray-400">{t('enter_any_code')}</p>
                </div>
              )}
            </>
          ) : (
            <BuyerSellerLink
              onSubmit={(sellerPhone, sellerIdNumber) => {
                submitSellerLink(sellerPhone, sellerIdNumber, state.buyerPhone);
              }}
            />
          )}
        </div>
      )}

      {/* 3. Waiting for seller approval */}
      {state.step === 'BUYER_WAITING_APPROVAL' && state.currentRequestId && (
        <BuyerWaiting
          requestId={state.currentRequestId}
          onApproved={onBuyerApproved}
        />
      )}

      {/* 4. Confirm seller's price */}
      {state.step === 'BUYER_CONFIRM_PRICE' && state.currentRequestId && (
        <BuyerConfirmPrice
          requestId={state.currentRequestId}
          onConfirm={buyerConfirmPrice}
          onReject={handleBack}
        />
      )}

      {/* 5. Bank details (phone pre-filled, no OTP) */}
      {state.step === 'BUYER_BANK_DETAILS' && (
        <UserDetailsForm
          role="BUYER"
          onSubmit={setBuyerDetails}
          prefillPhone={state.buyerPhone}
        />
      )}

      {/* 6. Financing offers */}
      {state.step === 'BUYER_FINANCING' && (
        <FinancingOffers vehiclePrice={state.price} onContinue={skipFinancing} onSkip={skipFinancing} />
      )}

      {/* 7. Deposit instructions */}
      {state.step === 'BUYER_DEPOSIT' && state.userBank && (
        <div className="space-y-6">
          <EscrowDetails userBank={state.userBank} price={state.price} onDetect={startPayment} />
        </div>
      )}

      {/* 8. Payment */}
      {state.step === 'BUYER_PAYMENT' && (
        <PaymentSimulator onComplete={completePayment} />
      )}

      {/* 9. Waiting for seller to transfer ownership */}
      {state.step === 'BUYER_WAITING_TRANSFER' && state.currentRequestId && (
        <BuyerWaitingTransfer
          requestId={state.currentRequestId}
          onTransferComplete={onTransferComplete}
        />
      )}

      {/* ===== SELLER FLOW ===== */}

      {/* 1. Register */}
      {state.step === 'SELLER_REGISTER' && (
        <SellerRegister onRegister={registerSeller} />
      )}

      {/* 2. Pending requests */}
      {state.step === 'SELLER_PENDING_REQUESTS' && (
        <SellerRequests
          sellerPhone={state.sellerPhone}
          sellerIdNumber={state.sellerIdNumber}
          onApprove={sellerApproveRequest}
        />
      )}

      {/* 3. Set agreed price */}
      {state.step === 'SELLER_SET_PRICE' && state.approvedRequest && (
        <SellerSetPrice
          request={state.approvedRequest}
          onSubmitPrice={sellerSetPrice}
        />
      )}

      {/* 4. Waiting for buyer payment */}
      {state.step === 'SELLER_WAITING_PAYMENT' && state.currentRequestId && (
        <SellerWaitingPayment
          requestId={state.currentRequestId}
          onPaymentReceived={onPaymentReceived}
        />
      )}

      {/* 5. Ownership transfer */}
      {state.step === 'SELLER_OWNERSHIP_TRANSFER' && (
        <OwnershipTransfer onComplete={sellerCompleteTransfer} />
      )}

      {/* ===== COMPLETE (both roles) ===== */}
      {state.step === 'COMPLETE' && (
        <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('success_title')}</h2>
            <p className="text-gray-500">{t('success_msg')}</p>
          </div>
          {state.vehicle && (
            <div className="bg-gray-50 p-6 rounded-3xl w-full text-left space-y-4 shadow-inner">
              <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                <span className="text-gray-500">{t('vehicle')}</span>
                <span className="font-medium text-gray-900">
                  {t(state.vehicle.make)} {t(state.vehicle.model)}
                </span>
              </div>
              {state.price > 0 && (
                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-500">{t('agreed_price')}</span>
                  <span className="font-bold text-green-600">₪{state.price.toLocaleString('he-IL')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('role_label')}</span>
                <span className="font-medium text-gray-900">
                  {state.role === 'BUYER' ? t('buyer') : t('seller')}
                </span>
              </div>
            </div>
          )}
          {/* Download Receipt Button */}
          <button
            onClick={() => setShowReceipt(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <FileText className="w-4 h-4" />
            {t('receipt_download')}
          </button>
        </div>
      )}

      {/* ===== FOOTER LINKS ===== */}
      {state.step === 'ROLE_SELECT' && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowPrivacy(true)}
              className="flex items-center gap-2 p-3 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              {t('menu_privacy')}
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="flex items-center gap-2 p-3 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t('menu_terms')}
            </button>
            <button
              onClick={() => setShowDataAccess(true)}
              className="flex items-center gap-2 p-3 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Database className="w-4 h-4" />
              {t('menu_data')}
            </button>
            <button
              onClick={() => setShowComplaint(true)}
              className="flex items-center gap-2 p-3 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {t('menu_complaint')}
            </button>
          </div>
        </div>
      )}

      {/* ===== CANCEL TRANSACTION BUTTON ===== */}
      {state.step !== 'ROLE_SELECT' && state.step !== 'COMPLETE' && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          {showCancelConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-semibold text-red-900">{t('cancel_confirm_title')}</p>
              <p className="text-xs text-red-700">{t('cancel_confirm_desc')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCancelConfirm(false); handleBack(); }}
                  className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
                >
                  {t('cancel_yes')}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  {t('cancel_no')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full text-center text-sm text-red-500 hover:text-red-600 py-2 transition-colors"
            >
              {t('cancel_transaction')}
            </button>
          )}
        </div>
      )}
    </Layout>
  );
}

export default App;
