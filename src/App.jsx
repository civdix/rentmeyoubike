import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomerView } from './views/CustomerView';
import { OwnerView } from './views/OwnerView';
import { AdminView } from './views/AdminView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { KYCWizardModal } from './components/KYCWizardModal';
import { PaymentModal } from './components/PaymentModal';
import { MobileInspectionView } from './components/MobileInspectionView';
import { InspectionDiffViewer } from './components/InspectionDiffViewer';
import { LegalPoliciesModal } from './components/LegalPoliciesModal';
import { LoginModal } from './components/LoginModal';

const MainContent = () => {
  const {
    role,
    activeWhatsAppModal,
    setActiveWhatsAppModal,
    activeKYCModal,
    setActiveKYCModal,
    activePaymentModal,
    setActivePaymentModal,
    activeInspectionModal,
    setActiveInspectionModal,
    activeDiffModal,
    setActiveDiffModal,
    activeLegalModal,
    setActiveLegalModal,
    isLoginModalOpen,
    closeLoginModal,
    loginRoleTarget
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {role === 'customer' && <CustomerView />}
        {role === 'owner' && <OwnerView />}
        {role === 'admin' && <AdminView />}
      </main>

      {/* Single Unified Footer */}
      <Footer />

      {/* Global Modals */}
      {activeWhatsAppModal && (
        <WhatsAppModal
          booking={activeWhatsAppModal.booking}
          vehicle={activeWhatsAppModal.vehicle}
          onClose={() => setActiveWhatsAppModal(null)}
          onLaunchKYC={(bookingId) => setActiveKYCModal({ bookingId })}
        />
      )}

      {activeKYCModal && (
        <KYCWizardModal
          bookingId={activeKYCModal.bookingId}
          onClose={() => setActiveKYCModal(null)}
          onSuccess={() => {
            setActivePaymentModal({ bookingId: activeKYCModal.bookingId });
          }}
        />
      )}

      {activePaymentModal && (
        <PaymentModal
          bookingId={activePaymentModal.bookingId}
          onClose={() => setActivePaymentModal(null)}
        />
      )}

      {activeInspectionModal && (
        <MobileInspectionView
          bookingId={activeInspectionModal.bookingId}
          type={activeInspectionModal.type}
          onClose={() => setActiveInspectionModal(null)}
        />
      )}

      {activeDiffModal && (
        <InspectionDiffViewer
          bookingId={activeDiffModal.bookingId}
          onClose={() => setActiveDiffModal(null)}
        />
      )}

      {activeLegalModal && (
        <LegalPoliciesModal
          initialTab={activeLegalModal.tab || 'rental_terms'}
          onClose={() => setActiveLegalModal(null)}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          initialRole={loginRoleTarget}
          onClose={closeLoginModal}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

