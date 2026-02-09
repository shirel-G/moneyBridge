import { Layout } from './components/Layout';
import { VehicleForm } from './components/VehicleForm';
import { UserDetailsForm } from './components/UserDetailsForm';
import { EscrowDetails } from './components/EscrowDetails';
import { PaymentSimulator } from './components/PaymentSimulator';
import { FinancingOffers } from './components/FinancingOffers';
import { InsuranceOffers } from './components/InsuranceOffers';
import { OwnershipTransfer } from './components/OwnershipTransfer';
import { useTransaction } from './hooks/useTransaction';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const {
    state,
    setVehicle,
    setSellerDetails,
    setBuyerDetails,
    startPayment,
    completePayment,
    skipFinancing,
    skipInsurance,
    completeOwnershipTransfer,
    reset,
  } = useTransaction();

  // Temporary back logic (ideally in hook)
  const handleBack = () => {
    switch (state.step) {
      case 'SELLER_DETAILS': reset(); break;
      case 'BUYER_DETAILS': setVehicle(state.vehicle!, state.price); break;
      default: reset();
    }
  };

  const getTitle = () => {
    switch (state.step) {
      case 'VEHICLE_LOOKUP': return t('welcome');
      case 'SELLER_DETAILS': return t('setup_seller');
      case 'BUYER_DETAILS': return t('setup_buyer');
      case 'DEPOSIT_INSTRUCTIONS': return t('deposit_title');
      case 'FINANCING_OFFERS': return t('financing_title');
      case 'INSURANCE_OFFERS': return t('insurance_title');
      case 'OWNERSHIP_TRANSFER': return t('ownership_transfer');
      case 'COMPLETE': return "Success"; // Maybe translate this too if key exists, or leave as universal
      default: return "Money Bridge";
    }
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
            <ArrowRight className="w-5 h-5" />
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
        )
      default:
        return null;
    }
  };

  return (
    <Layout
      title={getTitle()}
      actionButton={renderActionButton()}
      onBack={state.step !== 'VEHICLE_LOOKUP' && state.step !== 'COMPLETE' ? handleBack : undefined}
    >

      {state.step === 'VEHICLE_LOOKUP' && (
        <div className="space-y-6">
          <div className="text-center py-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{t('sell_safely')}</h2>
            <p className="text-gray-500 text-lg">{t('instant_verification')}</p>
          </div>
          <VehicleForm onVehicleVerified={setVehicle} />
        </div>
      )}

      {state.step === 'SELLER_DETAILS' && (
        <UserDetailsForm role="SELLER" onSubmit={setSellerDetails} />
      )}

      {state.step === 'BUYER_DETAILS' && (
        <UserDetailsForm role="BUYER" onSubmit={setBuyerDetails} />
      )}

      {state.step === 'DEPOSIT_INSTRUCTIONS' && state.userBank && (
        <div className="space-y-6">
          <EscrowDetails userBank={state.userBank} price={state.price} onDetect={startPayment} />
        </div>
      )}

      {state.step === 'PAYMENT_SIMULATION' && (
        <PaymentSimulator onComplete={completePayment} />
      )}

      {state.step === 'FINANCING_OFFERS' && (
        <FinancingOffers vehiclePrice={state.price} onContinue={skipFinancing} onSkip={skipFinancing} />
      )}

      {state.step === 'INSURANCE_OFFERS' && (
        <InsuranceOffers onContinue={skipInsurance} />
      )}

      {state.step === 'OWNERSHIP_TRANSFER' && (
        <OwnershipTransfer onComplete={completeOwnershipTransfer} />
      )}

      {state.step === 'COMPLETE' && (
        <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('success_title')}</h2>
            <p className="text-gray-500">{t('success_msg')}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl w-full text-left space-y-4 shadow-inner">
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">{t('transaction_id')}</span>
              <span className="font-mono text-gray-900">MB-2026-X99</span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">{t('vehicle')}</span>
              {/* Translate vehicle details if available */}
              <span className="font-medium text-gray-900">
                {state.vehicle ? `${t(state.vehicle.make)} ${t(state.vehicle.model)}` : ''}
              </span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">{t('seller')}</span>
              <span className="font-medium text-gray-900">{state.sellerDetails?.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('buyer')}</span>
              <span className="font-medium text-gray-900">{state.buyerDetails?.fullName}</span>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default App;
