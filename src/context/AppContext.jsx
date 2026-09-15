import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_INSPECTIONS,
  INITIAL_LEGAL_CONFIG,
  INITIAL_CUSTOMERS,
  INITIAL_OWNERS,
  INITIAL_DISPUTES,
  INITIAL_ADMIN_SETTINGS
} from '../data/mockData';
import {
  apiFetchVehicles,
  apiCreateVehicle,
  apiToggleVehicleStatus,
  apiVerifyVehicle,
  apiFetchBookings,
  apiCreateBooking,
  apiUpdateBookingStatus,
  apiUpdatePaymentStatus,
  apiVerifyKYC,
  apiFetchInspections,
  apiSaveInspection,
  apiFetchCustomers,
  apiToggleCustomerStatus,
  apiFetchOwners,
  apiToggleOwnerStatus,
  apiFetchDisputes,
  apiCreateDispute,
  apiAddDisputeNote,
  apiResolveDispute,
  apiFetchSettings,
  apiUpdateAdminSettings,
  apiUpdateLegalConfig,
  apiResetDemoData,
  apiAdminLogout
} from '../api/client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Active App Role: 'customer' | 'owner' | 'admin'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('vr_role') || 'customer';
  });

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRoleTarget, setLoginRoleTarget] = useState('customer');

  // Active Customer Tab: 'home' | 'browse' | 'my_bookings'
  const [customerTab, setCustomerTab] = useState('home');

  useEffect(() => {
    const handleNav = (e) => {
      if (e.detail) {
        setCustomerTab(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('vr_navigate', handleNav);
    return () => window.removeEventListener('vr_navigate', handleNav);
  }, []);

  // Purge any legacy demo mock data cached in browser localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const legacyBookings = localStorage.getItem('vr_bookings');
      if (legacyBookings && legacyBookings.includes('VRB-9021')) {
        localStorage.removeItem('vr_bookings');
        setBookings([]);
      }
      const legacyCustomers = localStorage.getItem('vr_customers');
      if (legacyCustomers && legacyCustomers.includes('Ananya Roy')) {
        localStorage.removeItem('vr_customers');
        setCustomers([]);
      }
      const legacyOwners = localStorage.getItem('vr_owners');
      if (legacyOwners && legacyOwners.includes('Radhe Shyam Sharma')) {
        localStorage.removeItem('vr_owners');
        setOwners([]);
      }
      const legacyDisputes = localStorage.getItem('vr_disputes');
      if (legacyDisputes && legacyDisputes.includes('DISP-101')) {
        localStorage.removeItem('vr_disputes');
        setDisputes([]);
      }
      const legacyVehicles = localStorage.getItem('vr_vehicles');
      if (legacyVehicles && legacyVehicles.includes('Radhe Divine Edition')) {
        localStorage.removeItem('vr_vehicles');
        setVehicles([]);
      }
    }
  }, []);

  // State with LocalStorage persistence + API sync
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_vehicles');
      if (saved && saved.includes('Radhe Divine Edition')) return [];
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_bookings');
      if (saved && saved.includes('VRB-9021')) return [];
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return [];
    }
  });

  const [inspections, setInspections] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_inspections');
      return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
    } catch {
      return {};
    }
  });

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_customers');
      if (saved && saved.includes('Ananya Roy')) return [];
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return [];
    }
  });

  const [owners, setOwners] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_owners');
      if (saved && saved.includes('Radhe Shyam Sharma')) return [];
      return saved ? JSON.parse(saved) : INITIAL_OWNERS;
    } catch {
      return [];
    }
  });

  const [disputes, setDisputes] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_disputes');
      if (saved && saved.includes('DISP-101')) return [];
      return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
    } catch {
      return [];
    }
  });

  const [adminSettings, setAdminSettingsState] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_admin_settings');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_SETTINGS;
    } catch {
      return INITIAL_ADMIN_SETTINGS;
    }
  });

  const [legalConfig, setLegalConfigState] = useState(() => {
    try {
      const saved = localStorage.getItem('vr_legal');
      return saved ? JSON.parse(saved) : INITIAL_LEGAL_CONFIG;
    } catch {
      return INITIAL_LEGAL_CONFIG;
    }
  });

  // Modals & UI Selection state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeWhatsAppModal, setActiveWhatsAppModal] = useState(null);
  const [activeKYCModal, setActiveKYCModal] = useState(null);
  const [activePaymentModal, setActivePaymentModal] = useState(null);
  const [activeInspectionModal, setActiveInspectionModal] = useState(null);
  const [activeDiffModal, setActiveDiffModal] = useState(null);
  const [activeLegalModal, setActiveLegalModal] = useState(null);
  const [activeFilter, setActiveFilter] = useState({
    type: 'all',
    maxPrice: 1200,
    area: 'all',
    search: '',
  });

  // Fetch live state from Backend API on mount & role change
  const refreshData = async () => {
    try {
      const [
        backendVehicles,
        backendBookings,
        backendInspections,
        backendCustomers,
        backendOwners,
        backendDisputes,
        backendSettings
      ] = await Promise.all([
        apiFetchVehicles().catch(() => null),
        apiFetchBookings().catch(() => null),
        apiFetchInspections().catch(() => null),
        apiFetchCustomers().catch(() => null),
        apiFetchOwners().catch(() => null),
        apiFetchDisputes().catch(() => null),
        apiFetchSettings().catch(() => null)
      ]);

      if (backendVehicles && Array.isArray(backendVehicles)) {
        setVehicles(backendVehicles);
      }
      if (backendBookings && Array.isArray(backendBookings)) {
        setBookings(backendBookings);
      }
      if (backendInspections && typeof backendInspections === 'object') {
        setInspections(backendInspections);
      }
      if (backendCustomers && Array.isArray(backendCustomers)) {
        setCustomers(backendCustomers);
      }
      if (backendOwners && Array.isArray(backendOwners)) {
        setOwners(backendOwners);
      }
      if (backendDisputes && Array.isArray(backendDisputes)) {
        setDisputes(backendDisputes);
      }
      if (backendSettings) {
        if (backendSettings.adminSettings) setAdminSettingsState(backendSettings.adminSettings);
        if (backendSettings.legalConfig) setLegalConfigState(backendSettings.legalConfig);
      }
    } catch (err) {
      console.warn('Could not sync with backend API, using cached data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [role]);

  // Save to localStorage on change for offline resilience
  useEffect(() => {
    localStorage.setItem('vr_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('vr_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('vr_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('vr_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('vr_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('vr_owners', JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    localStorage.setItem('vr_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('vr_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('vr_legal', JSON.stringify(legalConfig));
  }, [legalConfig]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vr_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vr_user');
    }
  }, [currentUser]);

  // Auth & RBAC Actions
  const openLoginModal = (targetRole = 'customer') => {
    setLoginRoleTarget(targetRole);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const logoutUser = async () => {
    try {
      await apiAdminLogout();
    } catch {
      // Ignore network errors on logout
    }
    setCurrentUser(null);
    setRole('customer');
    localStorage.removeItem('vr_user');
    localStorage.removeItem('vr_token');
    localStorage.removeItem('vr_admin_token');
    localStorage.setItem('vr_role', 'customer');
    refreshData();
  };

  // Actions
  const handleSetRole = (newRole) => {
    setRole(newRole);
  };

  const addVehicle = (vehicleData) => {
    const newId = `veh-${Date.now()}`;
    const newVeh = {
      id: newId,
      ...vehicleData,
      rating: 5.0,
      reviewsCount: 1,
      ownerVerified: true,
      vehicleVerified: false,
      verificationStatus: 'Pending',
      documentsVerified: false,
      inspectionCompleted: false,
      status: 'pending_approval',
      city: 'Vrindavan'
    };

    setVehicles((prev) => [newVeh, ...prev]);

    setOwners((prev) =>
      prev.map((o) =>
        o.name === vehicleData.ownerName ? { ...o, vehiclesCount: (o.vehiclesCount || 0) + 1 } : o
      )
    );

    // Sync with backend API
    apiCreateVehicle(newVeh).catch((err) => console.warn('API addVehicle error:', err));

    return newVeh;
  };

  const verifyVehicle = (vehicleId, actionState) => {
    let isVerified = false;
    let statusText = 'pending_approval';
    let vStatus = 'Pending';

    if (actionState === true || actionState === 'Verified') {
      isVerified = true;
      statusText = 'active';
      vStatus = 'Verified';
    } else if (actionState === 'Rejected') {
      isVerified = false;
      statusText = 'rejected';
      vStatus = 'Rejected';
    } else if (actionState === 'Changes Requested') {
      isVerified = false;
      statusText = 'changes_requested';
      vStatus = 'Changes Requested';
    } else if (actionState === 'Suspend' || actionState === false) {
      isVerified = false;
      statusText = 'suspended';
      vStatus = 'Suspended';
    }

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              vehicleVerified: isVerified,
              documentsVerified: isVerified,
              verificationStatus: vStatus,
              status: statusText
            }
          : v
      )
    );

    // Sync with backend API
    apiVerifyVehicle(vehicleId, actionState).catch((err) => console.warn('API verifyVehicle error:', err));
  };

  const toggleVehicleStatus = (vehicleId) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: v.status === 'active' ? 'suspended' : 'active' }
          : v
      )
    );

    apiToggleVehicleStatus(vehicleId).catch((err) => console.warn('API toggleVehicleStatus error:', err));
  };

  const toggleCustomerStatus = (customerId) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c))
    );

    apiToggleCustomerStatus(customerId).catch((err) => console.warn('API toggleCustomerStatus error:', err));
  };

  const toggleOwnerStatus = (ownerId) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === ownerId ? { ...o, status: o.status === 'active' ? 'suspended' : 'active' } : o))
    );

    apiToggleOwnerStatus(ownerId).catch((err) => console.warn('API toggleOwnerStatus error:', err));
  };

  const createBooking = (bookingInput) => {
    const refNum = `VRB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: refNum,
      vehicleId: bookingInput.vehicle.id,
      vehicleName: bookingInput.vehicle.name,
      customerName: bookingInput.customerName,
      customerPhone: bookingInput.customerPhone,
      customerEmail: bookingInput.customerEmail || `${bookingInput.customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      ownerName: bookingInput.vehicle.ownerName,
      ownerPhone: bookingInput.vehicle.ownerPhone || '+91 98371 44520',
      startDate: bookingInput.startDate,
      endDate: bookingInput.endDate,
      totalDays: bookingInput.totalDays,
      dailyPrice: bookingInput.vehicle.dailyRate,
      totalAmount: (bookingInput.vehicle.dailyRate * bookingInput.totalDays) + (bookingInput.saathiFee || 0),
      pickupLocation: bookingInput.vehicle.pickupAddress,
      status: 'Inquiry',
      paymentStatus: 'Pending',
      paymentId: null,
      kycStatus: 'Pending',
      preInspectionDone: false,
      postInspectionDone: false,
      bikeSaathiIncluded: Boolean(bookingInput.bikeSaathiIncluded),
      saathiFee: Number(bookingInput.saathiFee) || 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Sync with backend API
    apiCreateBooking(newBooking).catch((err) => console.warn('API createBooking error:', err));

    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus, extra = {}) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, ...extra } : b))
    );

    apiUpdateBookingStatus(bookingId, newStatus, extra).catch((err) => console.warn('API updateBookingStatus error:', err));
  };

  const updatePaymentStatus = (bookingId, paymentStatus, paymentId = null, extraRefundStatus = null) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const nextStatus = paymentStatus === 'Paid' && b.status === 'Payment Pending' ? 'Confirmed' : b.status;
          return {
            ...b,
            paymentStatus,
            refundStatus: extraRefundStatus !== null ? extraRefundStatus : b.refundStatus || 'None',
            paymentId: paymentId || b.paymentId || `pay_${bookingId}_${Math.floor(100 + Math.random() * 899)}`,
            status: nextStatus
          };
        }
        return b;
      })
    );

    apiUpdatePaymentStatus(bookingId, paymentStatus, paymentId, extraRefundStatus).catch((err) =>
      console.warn('API updatePaymentStatus error:', err)
    );
  };

  const saveInspection = (bookingId, type, inspectionData) => {
    setInspections((prev) => {
      const existing = prev[bookingId] || { bookingId, preRental: null, postRental: null };
      const updated = {
        ...existing,
        [type === 'pre' ? 'preRental' : 'postRental']: inspectionData
      };
      return { ...prev, [bookingId]: updated };
    });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          if (type === 'pre') {
            return { ...b, preInspectionDone: true, status: 'Active Rental' };
          } else {
            return { ...b, postInspectionDone: true, status: 'Completed' };
          }
        }
        return b;
      })
    );

    apiSaveInspection(bookingId, type, inspectionData).catch((err) => console.warn('API saveInspection error:', err));
  };

  const openDispute = ({ bookingId, issue, notesText, evidenceUrl }) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    const newDisp = {
      id: `DISP-${Math.floor(100 + Math.random() * 899)}`,
      bookingId,
      customerName: targetBooking ? targetBooking.customerName : 'Customer',
      ownerName: targetBooking ? targetBooking.ownerName : 'Owner',
      vehicleName: targetBooking ? targetBooking.vehicleName : 'Vehicle',
      issue: issue || 'Inspection disparity dispute',
      notes: [
        {
          sender: 'Admin',
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          text: notesText || 'Dispute opened by Administrator.'
        }
      ],
      evidence: evidenceUrl ? [evidenceUrl] : ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'],
      status: 'Open',
      outcome: '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setDisputes((prev) => [newDisp, ...prev]);
    if (targetBooking) {
      updateBookingStatus(bookingId, 'Dispute');
    }

    apiCreateDispute(newDisp).catch((err) => console.warn('API openDispute error:', err));

    return newDisp;
  };

  const addDisputeNote = (disputeId, text, sender = 'Admin') => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              notes: [
                ...d.notes,
                { sender, time: new Date().toISOString().replace('T', ' ').substring(0, 16), text }
              ]
            }
          : d
      )
    );

    apiAddDisputeNote(disputeId, text, sender).catch((err) => console.warn('API addDisputeNote error:', err));
  };

  const resolveDispute = (disputeId, outcome) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'Resolved', outcome } : d))
    );

    apiResolveDispute(disputeId, outcome).catch((err) => console.warn('API resolveDispute error:', err));
  };

  const verifyKYC = (bookingId, kycData = {}) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            kycStatus: 'Verified',
            status: b.status === 'KYC Pending' ? 'Payment Pending' : b.status
          };
        }
        return b;
      })
    );

    apiVerifyKYC(bookingId, kycData).catch((err) => console.warn('API verifyKYC error:', err));
  };

  const setAdminSettings = (newSettings) => {
    setAdminSettingsState(newSettings);
    apiUpdateAdminSettings(newSettings).catch((err) => console.warn('API setAdminSettings error:', err));
  };

  const setLegalConfig = (newLegal) => {
    setLegalConfigState(newLegal);
    apiUpdateLegalConfig(newLegal).catch((err) => console.warn('API setLegalConfig error:', err));
  };

  const resetDemoData = () => {
    setVehicles(INITIAL_VEHICLES);
    setBookings(INITIAL_BOOKINGS);
    setInspections(INITIAL_INSPECTIONS);
    setCustomers(INITIAL_CUSTOMERS);
    setOwners(INITIAL_OWNERS);
    setDisputes(INITIAL_DISPUTES);
    setAdminSettingsState(INITIAL_ADMIN_SETTINGS);
    setLegalConfigState(INITIAL_LEGAL_CONFIG);

    localStorage.removeItem('vr_vehicles');
    localStorage.removeItem('vr_bookings');
    localStorage.removeItem('vr_inspections');
    localStorage.removeItem('vr_customers');
    localStorage.removeItem('vr_owners');
    localStorage.removeItem('vr_disputes');
    localStorage.removeItem('vr_admin_settings');
    localStorage.removeItem('vr_legal');

    apiResetDemoData().catch((err) => console.warn('API resetDemoData error:', err));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        vehicles,
        bookings,
        inspections,
        customers,
        owners,
        disputes,
        adminSettings,
        setAdminSettings,
        legalConfig,
        setLegalConfig,
        selectedVehicle,
        setSelectedVehicle,
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
        activeFilter,
        setActiveFilter,
        addVehicle,
        verifyVehicle,
        toggleVehicleStatus,
        toggleCustomerStatus,
        toggleOwnerStatus,
        createBooking,
        updateBookingStatus,
        updatePaymentStatus,
        saveInspection,
        openDispute,
        addDisputeNote,
        resolveDispute,
        verifyKYC,
        resetDemoData,
        refreshData,
        currentUser,
        setCurrentUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginRoleTarget,
        openLoginModal,
        closeLoginModal,
        logoutUser,
        customerTab,
        setCustomerTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
