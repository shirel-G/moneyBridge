import { useState } from 'react';
import { Layout } from './components/Layout';
import { RoleSelect } from './components/RoleSelect';
import { VehicleForm } from './components/VehicleForm';
import { BuyerSellerLink } from './components/BuyerSellerLink';
import { BuyerWaiting } from './components/BuyerWaiting';
import { SellerRegister } from './components/SellerRegister';
import { SellerRequests } from './components/SellerRequests';
import { UserDetailsForm } from './components/UserDetailsForm';
import { EscrowDetails } from './components/EscrowDetails';
import { PaymentSimulator } from './components/PaymentSimulator';
import { FinancingOffers } from './components/FinancingOffers';
import { InsuranceOffers } from './components/InsuranceOffers';
import { OwnershipTransfer } from './components/OwnershipTransfer';
import { useTransaction } from './hooks/useTransaction';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [buyerPhone, setBuyerPhone] = useState('');

  const {
    state,
    selectRole,
    setVehicleForBuyer,
    submitSellerLink,
    onBuyerApproved,
    registerSeller,
    sellerApproveRequest,
    setBuyerDetails,
    startPayment,
    completePayment,
    skipFinancing,
    skipInsurance,
    completeOwnershipTransfer,
    reset,
  } = useTransaction();

  const getTitle = () => {
    switch (state.step) {
      case 'ROLE_SELECT': return t('welcome');
      case 'BUYER_VEHICLE_LOOKUP': return t('vehicle_lookup_title');
      case 'BUYER_ENTER_SELLER': return t('link_seller_title');
      case 'BUYER_WAITING_APPROVAL': return t('waiting_approval_title');
      case 'BUYER_DETAILS': return t('setup_buyer');
      case 'SELLER_REGISTER': return t('seller_register_title');
      case 'SELLER_PENDING_REQUESTS': return t('pending_requests_title');
      case 'DEPOSIT_INSTRUCTIONS': return t('deposit_title');
      case 'FINANCING_OFFERS': return t('financing_title');
      case 'INSURANCE_OFFERS': return t('insurance_title');
      case 'OWNERSHIP_TRANSFER': return t('ownership_transfer');
      case 'COMPLETE': return state.role === 'SELLER' ? t('request_approved') : t('success_title');
      default: return "Money Bridge";
    }
  };

  const handleBack = () => {
    // Simple back navigation
    reset();
  };

  const renderActionButton = () => {
    switch (state.step) {
      case 'DEPOSIT_INSTRUCTIONS':
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
            onClick={reset}
            className="w-full bg-gray-100 text-gray-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            {t('start_new')}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      title={getTitle()}
      actionButton={renderActionButton()}
      onBack={state.step !== 'ROLE_SELECT' && state.step !== 'COMPLETE' ? handleBack : undefined}
    >
      {/* Role Selection */}
      {state.step === 'ROLE_SELECT' && (
        <RoleSelect onSelectRole={selectRole} />
      )}

      {/* ===== BUYER FLOW ===== */}
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

      {state.step === 'BUYER_ENTER_SELLER' && (
        <div className="space-y-6">
          {/* Show vehicle summary */}
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

          {/* Phone input for buyer */}
          {!buyerPhone ? (
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
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="050-1234567"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length >= 10) {
                      setBuyerPhone(val);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <BuyerSellerLink
              onSubmit={(sellerPhone, sellerIdNumber) => {
                submitSellerLink(sellerPhone, sellerIdNumber, buyerPhone);
              }}
            />
          )}
        </div>
      )}

      {state.step === 'BUYER_WAITING_APPROVAL' && state.currentRequestId && (
        <BuyerWaiting
          requestId={state.currentRequestId}
          onApproved={onBuyerApproved}
        />
      )}

      {state.step === 'BUYER_DETAILS' && (
        <UserDetailsForm role="BUYER" onSubmit={setBuyerDetails} />
      )}

      {/* ===== SELLER FLOW ===== */}
      {state.step === 'SELLER_REGISTER' && (
        <SellerRegister onRegister={registerSeller} />
      )}

      {state.step === 'SELLER_PENDING_REQUESTS' && (
        <SellerRequests
          sellerPhone={state.sellerPhone}
          sellerIdNumber={state.sellerIdNumber}
          onApprove={sellerApproveRequest}
        />
      )}

      {/* ===== SHARED STEPS (buyer post-approval) ===== */}
      {state.step === 'FINANCING_OFFERS' && (
        <FinancingOffers vehiclePrice={state.price} onContinue={skipFinancing} onSkip={skipFinancing} />
      )}

      {state.step === 'DEPOSIT_INSTRUCTIONS' && state.userBank && (
        <div className="space-y-6">
          <EscrowDetails userBank={state.userBank} price={state.price} onDetect={startPayment} />
        </div>
      )}

      {state.step === 'PAYMENT_SIMULATION' && (
        <PaymentSimulator onComplete={completePayment} />
      )}

      {state.step === 'INSURANCE_OFFERS' && (
        <InsuranceOffers onContinue={skipInsurance} />
      )}

      {state.step === 'OWNERSHIP_TRANSFER' && (
        <OwnershipTransfer onComplete={completeOwnershipTransfer} />
      )}

      {/* ===== COMPLETE ===== */}
      {state.step === 'COMPLETE' && (
        <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {state.role === 'SELLER' ? t('seller_done_title') : t('success_title')}
            </h2>
            <p className="text-gray-500">
              {state.role === 'SELLER' ? t('seller_done_msg') : t('success_msg')}
            </p>
          </div>
          {state.vehicle && (
            <div className="bg-gray-50 p-6 rounded-3xl w-full text-left space-y-4 shadow-inner">
              <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                <span className="text-gray-500">{t('vehicle')}</span>
                <span className="font-medium text-gray-900">
                  {t(state.vehicle.make)} {t(state.vehicle.model)}
                </span>
              </div>
              {state.pricing && (
                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-500">{t('market_price')}</span>
                  <span className="font-bold text-green-600">₪{state.pricing.avgPrice.toLocaleString('he-IL')}</span>
                </div>
              )}
              {state.role === 'BUYER' && (
                <>
                  {state.buyerDetails && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('buyer')}</span>
                      <span className="font-medium text-gray-900">{state.buyerDetails.fullName}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default App;
