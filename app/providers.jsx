'use client';

import React from 'react';
import { AppProvider, useApp } from '../src/context/AppContext';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { MobileBottomNav } from '../src/components/MobileBottomNav';
import { WhatsAppModal } from '../src/components/WhatsAppModal';
import { KYCWizardModal } from '../src/components/KYCWizardModal';
import { PaymentModal } from '../src/components/PaymentModal';
import { MobileInspectionView } from '../src/components/MobileInspectionView';
import { InspectionDiffViewer } from '../src/components/InspectionDiffViewer';
import { LegalPoliciesModal } from '../src/components/LegalPoliciesModal';
import { LoginModal } from '../src/components/LoginModal';
import { ContactModal } from '../src/components/ContactModal';
import { SwitchToHostModal } from '../src/components/SwitchToHostModal';

function AppShell({ children }) {
  const {
    currentUser,
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
    openLoginModal,
    loginRoleTarget,
    loginModalMode,
    isContactModalOpen,
    closeContactModal,
    contactModalInitialData,
    isSwitchToHostModalOpen,
    closeSwitchToHostModal,
    confirmSwitchToHost
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Universal Sticky Header */}
      <Header />

      {/* Main Page Area: renders Next.js page routes natively */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 md:pb-0">
        {children}
      </main>

      {/* Unified Brand Footer */}
      <Footer />

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Interactive Modals */}
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
          initialMode={loginModalMode}
          onClose={closeLoginModal}
        />
      )}

      {isContactModalOpen && (
        <ContactModal
          isOpen={isContactModalOpen}
          initialData={contactModalInitialData}
          onClose={closeContactModal}
        />
      )}

      {isSwitchToHostModalOpen && (
        <SwitchToHostModal
          isOpen={isSwitchToHostModalOpen}
          currentUser={currentUser}
          onClose={closeSwitchToHostModal}
          onConfirm={confirmSwitchToHost}
          onRequireLogin={() => openLoginModal('owner')}
        />
      )}
    </div>
  );
}

export function Providers({ children }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
