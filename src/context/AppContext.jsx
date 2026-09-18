'use client';

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
  apiUpdateVehicle,
  apiToggleVehicleStatus,
  apiVerifyVehicle,
  apiFetchBookings,
  apiCreateBooking,
  apiUpdateBookingStatus,
  apiUpdatePaymentStatus,
  apiSendMessage,
  apiVerifyKYC,
  apiFetchInspections,
  apiSaveInspection,
  apiFetchCustomers,
  apiToggleCustomerStatus,
  apiFetchOwners,
  apiToggleOwnerStatus,
  apiFetchOwnerUpi,
  apiSaveOwnerUpi,
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
    if (typeof window === 'undefined') return 'customer';
    try {
      const savedUser = JSON.parse(localStorage.getItem('vr_user') || '{}');
      if (savedUser?.role === 'admin' || localStorage.getItem('vr_admin_token')) {
        return 'admin';
      }
    } catch {}
    const saved = localStorage.getItem('vr_role') || 'customer';
    return saved;
  });

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('vr_user');
      if (saved) return JSON.parse(saved);
      if (localStorage.getItem('vr_admin_token')) {
        return { id: 'admin-1', name: 'Platform Administrator', role: 'admin' };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRoleTarget, setLoginRoleTarget] = useState('customer');
  const [loginModalMode, setLoginModalMode] = useState('login'); // 'login' | 'signup'



  // Listen for unauthorized 401 events from API
  useEffect(() => {
    const handleUnauthorized = (e) => {
      console.warn('Authentication required:', e.detail?.message);
      openLoginModal(role || 'customer');
    };
    window.addEventListener('vr_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('vr_unauthorized', handleUnauthorized);
  }, [role]);

  // Security: Purge sensitive collections and legacy mock data from browser localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Never persist sensitive directory lists in client localStorage
      localStorage.removeItem('vr_customers');
      localStorage.removeItem('vr_owners');
      localStorage.removeItem('vr_disputes');

      const legacyBookings = localStorage.getItem('vr_bookings');
      if (legacyBookings && legacyBookings.includes('VRB-9021')) {
        localStorage.removeItem('vr_bookings');
        setBookings([]);
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
    if (typeof window === 'undefined') return INITIAL_VEHICLES;
    try {
      const saved = localStorage.getItem('vr_vehicles');
      if (saved && saved.includes('Radhe Divine Edition')) return [];
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_BOOKINGS;
    try {
      const saved = localStorage.getItem('vr_bookings');
      if (saved && saved.includes('VRB-9021')) return [];
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return [];
    }
  });

  const [inspections, setInspections] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_INSPECTIONS;
    try {
      const saved = localStorage.getItem('vr_inspections');
      return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
    } catch {
      return {};
    }
  });

  // Sensitive directory collections kept in reactive memory only (never written to localStorage)
  const [customers, setCustomers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [disputes, setDisputes] = useState([]);

  const [adminSettings, setAdminSettingsState] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_ADMIN_SETTINGS;
    try {
      const saved = localStorage.getItem('vr_admin_settings');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_SETTINGS;
    } catch {
      return INITIAL_ADMIN_SETTINGS;
    }
  });

  const [legalConfig, setLegalConfigState] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_LEGAL_CONFIG;
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalInitialData, setContactModalInitialData] = useState({});

  const openContactModal = (initialData = {}) => {
    setContactModalInitialData(initialData || {});
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactModalInitialData({});
  };

  useEffect(() => {
    const handleOpenContact = (e) => {
      openContactModal(e.detail || {});
    };
    window.addEventListener('vr_open_contact', handleOpenContact);
    return () => window.removeEventListener('vr_open_contact', handleOpenContact);
  }, []);
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
    localStorage.setItem('vr_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('vr_legal', JSON.stringify(legalConfig));
  }, [legalConfig]);

  useEffect(() => {
    if (currentUser) {
      const { password, pin, otp, token, ...safeUser } = currentUser;
      localStorage.setItem('vr_user', JSON.stringify(safeUser));
    } else {
      localStorage.removeItem('vr_user');
    }
  }, [currentUser]);

  // Ensure non-admin users cannot have role === 'admin'
  useEffect(() => {
    if (role === 'admin' && currentUser?.role !== 'admin') {
      setRole('customer');
      localStorage.setItem('vr_role', 'customer');
    }
  }, [role, currentUser]);

  // Switch to Host Popup State
  const [isSwitchToHostModalOpen, setIsSwitchToHostModalOpen] = useState(false);
  const promptSwitchToHost = () => setIsSwitchToHostModalOpen(true);
  const closeSwitchToHostModal = () => setIsSwitchToHostModalOpen(false);

  // Host Portal Navigation Tab: 'inventory' | 'add_new' | 'bookings' | 'payments'
  const [hostTab, setHostTab] = useState(() => {
    if (typeof window === 'undefined') return 'inventory';
    return localStorage.getItem('vr_host_tab') || 'inventory';
  });

  const handleSetHostTab = (newTab) => {
    setHostTab(newTab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vr_host_tab', newTab);
    }
  };
  const confirmSwitchToHost = () => {
    setIsSwitchToHostModalOpen(false);
    handleSetRole('owner');
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/host') {
        window.location.href = '/host';
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Auth & RBAC Actions
  const openLoginModal = (targetRole = 'customer', mode = 'login') => {
    setLoginRoleTarget(targetRole);
    setLoginModalMode(mode);
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
    localStorage.removeItem('vr_customers');
    localStorage.removeItem('vr_owners');
    localStorage.removeItem('vr_disputes');
    localStorage.setItem('vr_role', 'customer');
    refreshData();
  };

  // Actions
  const handleSetRole = (newRole) => {
    if (newRole === 'admin' && currentUser?.role !== 'admin') {
      setRole('customer');
      localStorage.setItem('vr_role', 'customer');
      return;
    }
    setRole(newRole);
    localStorage.setItem('vr_role', newRole);
  };

  const addVehicle = (vehicleData) => {
    if (!currentUser) {
      openLoginModal('owner');
      throw new Error('Host login required to list a bike.');
    }

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
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

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

  const updateVehicle = async (vehicleId, updatedData) => {
    if (!currentUser) {
      openLoginModal('owner');
      throw new Error('Host login required to edit vehicle.');
    }

    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, ...updatedData } : v))
    );

    try {
      const updated = await apiUpdateVehicle(vehicleId, updatedData);
      if (updated) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === vehicleId ? { ...v, ...updated } : v))
        );
      }
      return updated;
    } catch (err) {
      console.error('Failed to update vehicle on backend:', err);
      throw err;
    }
  };

  const toggleVehicleStatus = (vehicleId) => {
    if (!currentUser) {
      openLoginModal('owner');
      return;
    }

    const currentVeh = vehicles.find((v) => v.id === vehicleId);
    if (!currentVeh) return;

    const isApproved = currentVeh.vehicleVerified || currentVeh.verificationStatus === 'Verified';

    // Prevent owners from activating vehicles that have not been approved by an Admin
    if (currentVeh.status !== 'active' && !isApproved && currentUser.role !== 'admin') {
      alert('⚠️ This vehicle cannot be activated yet because it is awaiting Admin verification. Once our team approves your listing, you can activate or suspend it anytime.');
      return;
    }

    const nextStatus = currentVeh.status === 'active' ? 'suspended' : 'active';

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: nextStatus }
          : v
      )
    );

    apiToggleVehicleStatus(vehicleId).catch((err) => {
      console.warn('API toggleVehicleStatus error:', err);
      // Revert if rejected
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, status: currentVeh.status } : v
        )
      );
      alert(err.message || 'Failed to update vehicle status.');
    });
  };

  const toggleCustomerStatus = (customerId) => {
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c))
    );

    apiToggleCustomerStatus(customerId).catch((err) => console.warn('API toggleCustomerStatus error:', err));
  };

  const toggleOwnerStatus = (ownerId) => {
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

    setOwners((prev) =>
      prev.map((o) => (o.id === ownerId ? { ...o, status: o.status === 'active' ? 'suspended' : 'active' } : o))
    );

    apiToggleOwnerStatus(ownerId).catch((err) => console.warn('API toggleOwnerStatus error:', err));
  };

  const saveOwnerUpi = async (upiId) => {
    const cleanUpi = String(upiId).trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('vr_host_upi', cleanUpi);
    }
    setCurrentUser((prev) => (prev ? { ...prev, upiId: cleanUpi } : prev));
    try {
      const res = await apiSaveOwnerUpi(cleanUpi);
      return res;
    } catch (err) {
      console.warn('API saveOwnerUpi error:', err);
      throw err;
    }
  };

  const createBooking = (bookingInput) => {
    const refNum = `VRB-${Math.floor(1000 + Math.random() * 9000)}`;
    const veh = bookingInput.vehicle || {};
    const custName = bookingInput.customerName || currentUser?.name || 'Vrindavan Yatri';
    const custPhone = bookingInput.customerPhone || currentUser?.phone || '';
    const custEmail = bookingInput.customerEmail || currentUser?.email || `${custName.toLowerCase().replace(/\s+/g, '')}@example.com`;

    const dailyPrice = Number(veh.dailyRate || bookingInput.dailyPrice || 400);
    const totalDays = Number(bookingInput.totalDays || 1);
    const saathiFee = Number(bookingInput.saathiFee || (bookingInput.bikeSaathiIncluded ? 500 * totalDays : 0));
    const totalAmount = Number(bookingInput.totalAmount) || ((dailyPrice * totalDays) + saathiFee);

    const newBooking = {
      id: refNum,
      vehicleId: veh.id || bookingInput.vehicleId || 'veh-1',
      vehicleName: veh.name || bookingInput.vehicleName || 'Honda Activa 6G',
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      ownerName: veh.ownerName || bookingInput.ownerName || 'Radhe Shyam Sharma',
      ownerPhone: veh.ownerPhone || bookingInput.ownerPhone || '+91 98371 44520',
      startDate: bookingInput.startDate || new Date().toISOString().split('T')[0],
      endDate: bookingInput.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      totalDays,
      dailyPrice,
      totalAmount,
      pickupLocation: veh.pickupAddress || bookingInput.pickupLocation || 'Prem Mandir Area, Vrindavan',
      status: 'Inquiry',
      paymentStatus: 'Pending',
      paymentId: null,
      kycStatus: 'Pending',
      preInspectionDone: false,
      postInspectionDone: false,
      bikeSaathiIncluded: Boolean(bookingInput.bikeSaathiIncluded),
      saathiFee,
      source: bookingInput.source || 'WhatsApp / 1-Click Booking',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Sync with backend API (and auto-send email to Admin)
    apiCreateBooking(newBooking).catch((err) => console.warn('API createBooking error:', err));

    // Automatically persist booking inquiry to live chat room in the database
    const bookingChatText = `Radhe Radhe! 🙏 Booking Inquiry #${newBooking.id}\n🛵 Vehicle: ${newBooking.vehicleName}\n👤 Renter: ${newBooking.customerName} (${newBooking.customerPhone})\n📅 Dates: ${newBooking.startDate} to ${newBooking.endDate} (${newBooking.totalDays} day(s))\n📍 Pickup: ${newBooking.pickupLocation}\n💰 Total: ₹${newBooking.totalAmount}`;

    apiSendMessage({
      conversationId: `conv-${newBooking.id}`,
      bookingId: newBooking.id,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      senderRole: 'customer',
      text: bookingChatText
    }).catch((err) => console.warn('API auto-chat initial message error:', err));

    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus, extra = {}) => {
    if (!currentUser) {
      openLoginModal('customer');
      return;
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, ...extra } : b))
    );

    apiUpdateBookingStatus(bookingId, newStatus, extra).catch((err) => console.warn('API updateBookingStatus error:', err));
  };

  const updatePaymentStatus = (bookingId, paymentStatus, paymentId = null, extraRefundStatus = null) => {
    if (!currentUser) {
      openLoginModal('customer');
      return;
    }

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
    if (!currentUser) {
      openLoginModal(role || 'customer');
      throw new Error('Please sign in before saving an inspection.');
    }

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
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }
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
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

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
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'Resolved', outcome } : d))
    );

    apiResolveDispute(disputeId, outcome).catch((err) => console.warn('API resolveDispute error:', err));
  };

  const verifyKYC = (bookingId, kycData = {}) => {
    if (!currentUser) {
      openLoginModal('customer');
      return;
    }

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

    setCurrentUser((prev) => (prev ? { ...prev, kycStatus: 'Verified' } : prev));
    setCustomers((prev) =>
      prev.map((c) =>
        c.phone === currentUser.phone || c.id === currentUser.id
          ? { ...c, kycStatus: 'Verified' }
          : c
      )
    );

    apiVerifyKYC(bookingId, kycData).catch((err) => console.warn('API verifyKYC error:', err));
  };

  const setAdminSettings = (newSettings) => {
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

    setAdminSettingsState(newSettings);
    apiUpdateAdminSettings(newSettings).catch((err) => console.warn('API setAdminSettings error:', err));
  };

  const setLegalConfig = (newLegal) => {
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }

    setLegalConfigState(newLegal);
    apiUpdateLegalConfig(newLegal).catch((err) => console.warn('API setLegalConfig error:', err));
  };

  const resetDemoData = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      openLoginModal('admin');
      return;
    }
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
        isContactModalOpen,
        contactModalInitialData,
        openContactModal,
        closeContactModal,
        activeFilter,
        setActiveFilter,
        addVehicle,
        updateVehicle,
        verifyVehicle,
        toggleVehicleStatus,
        toggleCustomerStatus,
        toggleOwnerStatus,
        saveOwnerUpi,
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
        loginModalMode,
        setLoginModalMode,
        openLoginModal,
        closeLoginModal,
        logoutUser,
        customerTab: 'home',
        setCustomerTab: () => {},
        hostTab,
        setHostTab: handleSetHostTab,
        isSwitchToHostModalOpen,
        promptSwitchToHost,
        closeSwitchToHostModal,
        confirmSwitchToHost
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
