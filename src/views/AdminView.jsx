'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatusBadge, VerifiedOwnerBadge, VerifiedVehicleBadge } from '../components/TrustBadges';
import { AdminStrategyView } from './AdminStrategyView';
import {
  apiAdminLogin,
  apiAdminLogout,
  apiFetchConversations,
  apiFetchMessages,
  apiSendMessage,
  apiMarkMessagesRead
} from '../api/client';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  IndianRupee,
  Users,
  Bike,
  FileText,
  Camera,
  RefreshCw,
  Lock,
  Eye,
  Edit3,
  TrendingUp,
  Megaphone,
  UserCheck,
  UserX,
  CreditCard,
  Sliders,
  Search,
  PlusCircle,
  ShieldAlert,
  Key,
  LogOut,
  Filter,
  Check,
  MessageSquare,
  ArrowRight,
  Database,
  Download,
  Send,
  CheckCheck,
  Phone,
  ExternalLink,
  Clock,
  Sparkles,
  X,
  Maximize2
} from 'lucide-react';

export const AdminView = () => {
  const {
    currentUser,
    role,
    setRole,
    vehicles,
    bookings,
    inspections,
    customers,
    owners,
    disputes,
    adminSettings,
    setAdminSettings,
    createBooking,
    verifyKYC,
    verifyVehicle,
    toggleVehicleStatus,
    toggleCustomerStatus,
    toggleOwnerStatus,
    updateBookingStatus,
    updatePaymentStatus,
    openDispute,
    addDisputeNote,
    resolveDispute,
    setActiveDiffModal,
    refreshData,
    setCurrentUser,
    setCustomerTab
  } = useApp();

  const hasAdminToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('vr_admin_token') || localStorage.getItem('vr_role') === 'admin');
  const isAuthorized = role === 'admin' || currentUser?.role === 'admin' || hasAdminToken;

  // Keep role & currentUser in sync with admin authorization
  React.useEffect(() => {
    if (isAuthorized) {
      if (role !== 'admin') {
        setRole('admin');
      }
      if (currentUser?.role !== 'admin' && setCurrentUser) {
        try {
          const savedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vr_user') || '{}') : {};
          if (savedUser?.role === 'admin') {
            setCurrentUser(savedUser);
          } else {
            setCurrentUser({ id: 'admin-1', name: 'Platform Administrator', role: 'admin' });
          }
        } catch {
          setCurrentUser({ id: 'admin-1', name: 'Platform Administrator', role: 'admin' });
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('vr_role', 'admin');
        if (!localStorage.getItem('vr_admin_token') && localStorage.getItem('vr_token')) {
          localStorage.setItem('vr_admin_token', localStorage.getItem('vr_token'));
        }
      }
    }
  }, [isAuthorized, role, currentUser, setRole, setCurrentUser]);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('overview'); // overview, customers, owners, vehicles, bookings, inspections, disputes, payments, settings, strategy
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Search & Filter state for sections
  const [customerSearch, setCustomerSearch] = useState('');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleFilterStatus, setVehicleFilterStatus] = useState('all');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // Admin Actions Modals state
  const [selectedDisputeModal, setSelectedDisputeModal] = useState(null); // dispute object
  const [newDisputeModal, setNewDisputeModal] = useState(false); // boolean
  const [newDisputeBookingId, setNewDisputeBookingId] = useState('');
  const [newDisputeIssue, setNewDisputeIssue] = useState('');

  const [disputeNoteText, setDisputeNoteText] = useState('');
  const [disputeOutcomeText, setDisputeOutcomeText] = useState('');

  const [refundModalBooking, setRefundModalBooking] = useState(null);
  const [refundType, setRefundType] = useState('full');

  // Change request modal state
  const [changeReqModalVehicle, setChangeReqModalVehicle] = useState(null);
  const [changeReqNote, setChangeReqNote] = useState('');

  // Vehicle Document & KYC Inspection Modal State
  const [inspectingVehicle, setInspectingVehicle] = useState(null);
  const [inspectDocPreview, setInspectDocPreview] = useState(null); // { title: string, url: string }

  // Manual WhatsApp Booking Creation State
  const [manualBookingModalOpen, setManualBookingModalOpen] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualVehicleId, setManualVehicleId] = useState('');
  const [manualStartDate, setManualStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualEndDate, setManualEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // 7-Step WhatsApp Pipeline Modal State
  const [selectedWhatsAppPipelineBooking, setSelectedWhatsAppPipelineBooking] = useState(null);

  // Live Chat Management State
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [activeConvMessages, setActiveConvMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const adminChatContainerRef = React.useRef(null);

  const adminQuickReplies = [
    'Radhe Radhe! 🙏 Welcome to Rent to Cent Vrindavan. How may we assist you?',
    'Your booking request is confirmed! Please upload Aadhaar & Driving Licence for instant verification.',
    'Your vehicle is prepped and ready for pickup at our Vrindavan Hub (near Prem Mandir).',
    'Please bring your original Driving Licence and refundable deposit at the time of pickup.',
    'A sanitized helmet is included complimentary with your rental bike.',
    'Feel free to ask any question regarding locations, fuel, or return timings!'
  ];

  const formatChatTime = (ts) => {
    if (!ts) return 'Just now';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return 'Just now';
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Just now';
    }
  };

  const loadConversations = React.useCallback(async () => {
    try {
      const data = await apiFetchConversations();
      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (err) {
      console.warn('Error fetching chat conversations:', err.message);
    }
  }, []);

  const loadActiveMessages = React.useCallback(async (convId) => {
    if (!convId) return;
    try {
      const data = await apiFetchMessages({ conversationId: convId });
      if (Array.isArray(data)) {
        setActiveConvMessages(data);
      }
    } catch (err) {
      console.warn('Error fetching active chat messages:', err.message);
    }
  }, []);

  // Poll conversations every 3s
  React.useEffect(() => {
    if (!isAuthorized) return;
    loadConversations();
    const interval = setInterval(loadConversations, 3000);
    return () => clearInterval(interval);
  }, [isAuthorized, loadConversations]);

  // Poll active chat messages every 2.5s
  React.useEffect(() => {
    if (!isAuthorized || !selectedConvId) return;
    loadActiveMessages(selectedConvId);
    const interval = setInterval(() => loadActiveMessages(selectedConvId), 2500);
    return () => clearInterval(interval);
  }, [isAuthorized, selectedConvId, loadActiveMessages]);

  // Auto-scroll ONLY inner chat feed to bottom, never scrolling the outer page
  React.useEffect(() => {
    if (activeTab === 'chat' && adminChatContainerRef.current) {
      adminChatContainerRef.current.scrollTop = adminChatContainerRef.current.scrollHeight;
    }
  }, [activeConvMessages, activeTab]);

  const handleSelectConversation = async (conv) => {
    setSelectedConvId(conv.conversationId);
    setChatLoading(true);
    try {
      const data = await apiFetchMessages({ conversationId: conv.conversationId });
      setActiveConvMessages(Array.isArray(data) ? data : []);
      await apiMarkMessagesRead(conv.conversationId);
      setConversations((prev) =>
        prev.map((c) => (c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.warn('Error selecting conversation:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAdminSendMessage = async (customText) => {
    const text = (customText || chatInputText).trim();
    if (!text || !selectedConvId || isSendingChat) return;

    const currentConv = conversations.find((c) => c.conversationId === selectedConvId);
    setIsSendingChat(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      conversationId: selectedConvId,
      bookingId: currentConv?.bookingId || null,
      senderRole: 'admin',
      senderName: 'Support Admin',
      customerName: currentConv?.customerName || 'Customer',
      customerPhone: currentConv?.customerPhone || '',
      text,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setActiveConvMessages((prev) => [...prev, optimisticMsg]);
    if (!customText) setChatInputText('');

    try {
      const saved = await apiSendMessage({
        conversationId: selectedConvId,
        bookingId: currentConv?.bookingId || null,
        customerName: currentConv?.customerName || 'Customer',
        customerPhone: currentConv?.customerPhone || '',
        senderRole: 'admin',
        text
      });

      setActiveConvMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
      loadConversations();
    } catch (err) {
      console.error('Failed to send admin message:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const totalUnreadChatCount = conversations.reduce((acc, c) => acc + (Number(c.unreadCount) || 0), 0);

  const filteredConversations = conversations.filter((c) => {
    if (!chatSearch.trim()) return true;
    const q = chatSearch.toLowerCase();
    return (
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.customerPhone && c.customerPhone.toLowerCase().includes(q)) ||
      (c.bookingId && c.bookingId.toLowerCase().includes(q)) ||
      (c.lastMessageText && c.lastMessageText.toLowerCase().includes(q))
    );
  });

  const selectedConv =
    conversations.find((c) => c.conversationId === selectedConvId) ||
    (selectedConvId ? { conversationId: selectedConvId, customerName: 'Customer' } : null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    platformCommission: adminSettings.platformCommission || 15,
    minRentalDuration: adminSettings.minRentalDuration || '1 Day',
    whatsAppNumber: adminSettings.whatsAppNumber || '+919720965985',
    supportContact: adminSettings.supportContact || 'support@vrindavanrides.in',
    protectionInfo: adminSettings.protectionInfo || '',
    rentalRules: adminSettings.rentalRules || '',
    cancellationRules: adminSettings.cancellationRules || ''
  });

  // Calculate Overview Metrics (Prompt required 10 overview metrics)
  const totalVehiclesCount = vehicles.length;
  const verifiedVehiclesCount = vehicles.filter((v) => v.vehicleVerified || v.verificationStatus === 'Verified').length;
  const pendingVehiclesCount = vehicles.filter((v) => v.status === 'pending_approval' || v.verificationStatus === 'Pending').length;
  const totalOwnersCount = owners.length;
  const totalCustomersCount = customers.length;
  const activeRentalsCount = bookings.filter((b) => b.status === 'Active Rental').length;
  const upcomingBookingsCount = bookings.filter((b) => ['Confirmed', 'Payment Pending', 'Pickup Pending'].includes(b.status)).length;
  const completedRentalsCount = bookings.filter((b) => b.status === 'Completed').length;
  
  const grossBookingValue = bookings.reduce(
    (sum, b) => (['Paid', 'Confirmed', 'Active Rental', 'Completed'].includes(b.paymentStatus) || b.paymentStatus === 'Paid' ? sum + b.totalAmount : sum),
    0
  );
  const platformCommissionAmount = Math.round(grossBookingValue * ((adminSettings.platformCommission || 15) / 100));

  // PIN Auth Handler
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) return;
    setPinLoading(true);
    setPinError(false);
    try {
      const res = await apiAdminLogin(cleanPin);
      if (res?.success) {
        if (setCurrentUser) setCurrentUser(res?.user || { id: 'admin-1', name: 'Platform Administrator', role: 'admin' });
        setRole('admin');
        setPinError(false);
        if (refreshData) refreshData();
      } else {
        setPinError(true);
      }
    } catch (err) {
      setPinError(true);
    } finally {
      setPinLoading(false);
    }
  };

  // Settings Form Submit Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setAdminSettings(settingsForm);
    alert('✅ Admin Platform Settings updated successfully!');
  };

  // Manual WhatsApp booking submission handler

  const handleCreateManualBooking = (e) => {
    e.preventDefault();
    const selVeh = vehicles.find((v) => v.id === manualVehicleId) || vehicles[0];
    const start = new Date(manualStartDate);
    const end = new Date(manualEndDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newBooking = createBooking({
      vehicle: selVeh,
      customerName: manualCustomerName || 'Walk-in Customer',
      customerPhone: manualCustomerPhone || '',
      startDate: manualStartDate,
      endDate: manualEndDate,
      totalDays
    });

    setManualBookingModalOpen(false);
    setManualCustomerName('');
    setManualCustomerPhone('');
    alert(`💬 Manual WhatsApp Booking #${newBooking.id} created & logged in admin records!`);
  };

  // 7-Step Admin WhatsApp Action Pipeline Handlers
  const handleStep1ConfirmAvailability = (b) => {
    updateBookingStatus(b.id, 'KYC Pending');
    alert(`Step 1 Complete: Availability confirmed for #${b.id}! Status updated to KYC Pending.`);
  };

  const handleStep2VerifyCustomer = (b) => {
    verifyKYC(b.id);
    updateBookingStatus(b.id, 'Payment Pending');
    alert(`Step 2 Complete: Customer ${b.customerName} verified! Status updated to Payment Pending.`);
  };

  const handleStep3ConfirmPrice = (b) => {
    alert(`Step 3 Complete: Rental price confirmed at ₹${b.totalAmount} for ${b.totalDays} day(s).`);
  };

  const handleStep4SendPaymentLink = (b) => {
    const paymentMsg =
      `Hi ${b.customerName},\n\n` +
      `Your booking for *${b.vehicleName}* (${b.vehicleId}) is confirmed for dates ${b.startDate} to ${b.endDate}.\n` +
      `💰 *Total Amount*: ₹${b.totalAmount}\n\n` +
      `Please pay via UPI / Card link: https://vrindavanrides.in/pay/${b.id}\n\n` +
      `Platform Support: +919720965985`;

    navigator.clipboard.writeText(paymentMsg);
    const phoneNum = b.customerPhone.replace(/[^0-9]/g, '');
    if (phoneNum) {
      window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(paymentMsg)}`, '_blank');
    }
    alert(`Step 4 Complete: Payment link message copied & WhatsApp opened!`);
  };

  const handleStep5MarkPaymentReceived = (b) => {
    updatePaymentStatus(b.id, 'Paid');
    updateBookingStatus(b.id, 'Confirmed');
    alert(`Step 5 Complete: Payment marked as RECEIVED for #${b.id}! Status set to Confirmed.`);
  };

  const handleStep6ConfirmBooking = (b) => {
    updateBookingStatus(b.id, 'Confirmed');
    alert(`Step 6 Complete: Official Booking Voucher #${b.id} confirmed!`);
  };

  const handleStep7SendPickupInstructions = (b) => {
    const pickupMsg =
      `Radhe Radhe ${b.customerName}! 🌸\n\n` +
      `Your Vrindavan Rides booking #${b.id} is confirmed!\n\n` +
      `📍 *Pickup Location*: ${b.pickupLocation || 'Prem Mandir Marg, Gate No. 2, Vrindavan'}\n` +
      `🛵 *Vehicle*: ${b.vehicleName}\n` +
      `📅 *Handover*: ${b.startDate} at 09:00 AM\n` +
      `📞 *Platform Support*: +919720965985\n\n` +
      `Note: Please perform your mobile 7-angle digital inspection upon handover using link: https://vrindavanrides.in/inspection/${b.id}?type=pre`;

    navigator.clipboard.writeText(pickupMsg);
    const phoneNum = b.customerPhone.replace(/[^0-9]/g, '');
    if (phoneNum) {
      window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(pickupMsg)}`, '_blank');
    }
    alert(`Step 7 Complete: Pickup instructions (with platform mediation - zero owner phone exposure) sent via WhatsApp!`);
  };

  // Open dispute submit

  const handleCreateDispute = (e) => {
    e.preventDefault();
    if (!newDisputeBookingId) return;
    openDispute({
      bookingId: newDisputeBookingId,
      issue: newDisputeIssue,
      notesText: `Admin opened dispute: ${newDisputeIssue}`
    });
    setNewDisputeModal(false);
    setNewDisputeBookingId('');
    setNewDisputeIssue('');
    alert('⚠️ New Dispute opened successfully!');
  };

  // Add dispute note submit
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!selectedDisputeModal || !disputeNoteText) return;
    addDisputeNote(selectedDisputeModal.id, disputeNoteText, 'System Admin');
    // Refresh modal local state
    const updated = disputes.find((d) => d.id === selectedDisputeModal.id);
    if (updated) {
      setSelectedDisputeModal({
        ...updated,
        notes: [
          ...updated.notes,
          { sender: 'System Admin', time: new Date().toISOString().replace('T', ' ').substring(0, 16), text: disputeNoteText }
        ]
      });
    }
    setDisputeNoteText('');
  };

  // Resolve dispute submit
  const handleResolveDispute = (outcome) => {
    if (!selectedDisputeModal) return;
    resolveDispute(selectedDisputeModal.id, outcome || disputeOutcomeText || 'Resolved by Administrator');
    setSelectedDisputeModal(null);
    setDisputeOutcomeText('');
    alert('✅ Dispute marked as Resolved!');
  };

  // Filtered lists
  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)
  );

  const filteredOwners = owners.filter(
    (o) => o.name.toLowerCase().includes(ownerSearch.toLowerCase()) || o.phone.includes(ownerSearch)
  );

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) || v.ownerName.toLowerCase().includes(vehicleSearch.toLowerCase()) || v.registrationNumber.toLowerCase().includes(vehicleSearch.toLowerCase());
    const matchesStatus = vehicleFilterStatus === 'all' || v.status === vehicleFilterStatus || (vehicleFilterStatus === 'pending' && (!v.vehicleVerified || v.status === 'pending_approval'));
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus === 'all') return true;
    return b.status === bookingFilterStatus;
  });

  // ----------------------------------------------------
  // RBAC AUTH LOCK SCREEN FOR NON-ADMIN USERS
  // ----------------------------------------------------
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl mx-auto flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-heading font-extrabold text-2xl text-white">Admin Access Restricted</h2>
            <p className="text-xs text-slate-400 mt-2">
              Enter your Administrator Security Passcode / PIN to unlock the control center.
            </p>
          </div>

          {pinError && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-400 text-xs flex items-center gap-2 text-left animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Invalid Admin Passcode. Please check your credentials and try again.</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Security Passcode / PIN</span>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-normal"
                >
                  {showPin ? <Eye className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Hide' : 'Show'}</span>
                </button>
              </label>

              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Admin PIN (Default: 7777)"
                  className="w-full bg-slate-950 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 text-sm font-mono tracking-wider focus:outline-none focus:border-purple-500 transition-colors"
                  autoFocus
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pinLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {pinLoading ? <span>Verifying...</span> : <span>Unlock Admin Portal</span>}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setRole('customer');
              if (setCustomerTab) setCustomerTab('browse');
            }}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer border border-slate-750"
          >
            Return to Renter Marketplace
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN AUTHORIZED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      {/* Top Admin Security Status Bar - Flush with navbar, no gap */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-emerald-400">Authenticated Administrator</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Vrindavan Bike Rental Control Center</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                apiAdminLogout();
                if (setCurrentUser) setCurrentUser(null);
                setRole('customer');
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              Exit Admin Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
        {/* ----------------------------------------------------
            ADMIN SECTIONS TAB NAVIGATION (ALWAYS AT TOP)
            ---------------------------------------------------- */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex gap-2 text-xs font-bold overflow-x-auto custom-scrollbar shadow-md">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'chat', label: `💬 Live Chat${totalUnreadChatCount > 0 ? ` (${totalUnreadChatCount})` : ''}` },
            { id: 'customers', label: `👥 Customers (${customers.length})` },
            { id: 'owners', label: `👤 Owners (${owners.length})` },
            { id: 'vehicles', label: `🛵 Vehicles (${vehicles.length})` },
            { id: 'bookings', label: `📋 Bookings (${bookings.length})` },
            { id: 'inspections', label: `📷 Inspections (${Object.keys(inspections).length})` },
            { id: 'disputes', label: `⚠️ Disputes (${disputes.length})` },
            { id: 'payments', label: '💰 Payments & Ledger' },
            { id: 'settings', label: '⚙️ Platform Settings' },
            { id: 'strategy', label: '🚀 Growth Roadmap' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ----------------------------------------------------
            SECTION 0: OVERVIEW (RENDERED ONLY WHEN OVERVIEW TAB IS SELECTED)
            ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Vrindavan Rental Operations Overview
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* Metric 1: Total Vehicles */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Total Vehicles</span>
                    <Bike className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-white">{totalVehiclesCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Scooters, Bikes, EVs, Cycles</span>
                </div>

                {/* Metric 2: Verified Vehicles */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Verified Vehicles</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-emerald-400">{verifiedVehiclesCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">RC & Insurance Verified</span>
                </div>

                {/* Metric 3: Pending Vehicles */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Pending Vehicles</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-amber-400">{pendingVehiclesCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Needs admin document audit</span>
                </div>

                {/* Metric 4: Total Owners */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Total Owners</span>
                    <UserCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-blue-400">{totalOwnersCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Registered host fleet owners</span>
                </div>

                {/* Metric 5: Total Customers */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Total Customers</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-indigo-400">{totalCustomersCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Verified yatra riders</span>
                </div>

                {/* Metric 6: Active Rentals */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Active Rentals</span>
                    <Bike className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-emerald-300">{activeRentalsCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Currently on Vrindavan roads</span>
                </div>

                {/* Metric 7: Upcoming Bookings */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Upcoming Bookings</span>
                    <FileText className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-cyan-400">{upcomingBookingsCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Confirmed for future dates</span>
                </div>

                {/* Metric 8: Completed Rentals */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Completed Rentals</span>
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-teal-400">{completedRentalsCount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Successful returns logged</span>
                </div>

                {/* Metric 9: Gross Booking Value */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Gross Booking Value</span>
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-emerald-400">₹{grossBookingValue}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">Total revenue generated</span>
                </div>

                {/* Metric 10: Platform Commission */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold mb-1">
                    <span>Platform Commission</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-amber-400">₹{platformCommissionAmount}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {adminSettings.platformCommission || 15}% platform earnings
                  </span>
                </div>
              </div>
            </div>

            {/* VRINDAVAN MARKETPLACE SNAPSHOT CARDS */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-heading text-lg font-extrabold text-white">Vrindavan Marketplace Operational Snapshot</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>Fleet Category Breakdown</span>
                    <Bike className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <ul className="space-y-2 pt-2">
                    <li className="flex justify-between">
                      <span>Scooters (Activa, Jupiter):</span>
                      <strong className="text-white">{vehicles.filter(v => v.type === 'scooter').length}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Bicycles / Cycles:</span>
                      <strong className="text-emerald-400">{vehicles.filter(v => v.type === 'bicycle').length}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Motorcycles & Cruisers:</span>
                      <strong className="text-blue-400">{vehicles.filter(v => v.type === 'motorcycle' || v.type === 'cruiser').length}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Electric Scooters & Cycles:</span>
                      <strong className="text-amber-400">{vehicles.filter(v => v.fuelType?.toLowerCase().includes('electric') || v.type === 'electric').length}</strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>Bookings Lifecycle Pipeline</span>
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <ul className="space-y-2 pt-2">
                    <li className="flex justify-between">
                      <span>Inquiries & KYC Pending:</span>
                      <strong className="text-amber-400">
                        {bookings.filter((b) => b.status === 'Inquiry' || b.status === 'KYC Pending').length}
                      </strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Confirmed & Active Rentals:</span>
                      <strong className="text-emerald-400">
                        {bookings.filter((b) => ['Confirmed', 'Active Rental', 'Pickup Pending'].includes(b.status)).length}
                      </strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Disputes Active:</span>
                      <strong className="text-rose-400">
                        {disputes.filter((d) => d.status === 'Open').length}
                      </strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>Quick Admin Navigation</span>
                    <Sliders className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-2.5 rounded-lg border border-slate-800 text-[11px] font-bold text-left"
                    >
                      🛵 Verify Fleet ({pendingVehiclesCount})
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-2.5 rounded-lg border border-slate-800 text-[11px] font-bold text-left"
                    >
                      📋 All Bookings ({bookings.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('disputes')}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-2.5 rounded-lg border border-slate-800 text-[11px] font-bold text-left"
                    >
                      ⚠️ Disputes ({disputes.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-2.5 rounded-lg border border-slate-800 text-[11px] font-bold text-left"
                    >
                      ⚙️ Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION: LIVE CHAT & CONVERSATIONS
            ---------------------------------------------------- */}
        {activeTab === 'chat' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Customer Live Chat Operations</span>
                  {totalUnreadChatCount > 0 && (
                    <span className="bg-emerald-500 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-sm animate-pulse">
                      {totalUnreadChatCount} New Inquiries
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time two-way messaging with customers and pilgrims inquiring via instant bookings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadConversations}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Inquiries</span>
                </button>
              </div>
            </div>

            {/* Main Split-Pane Live Chat UI */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-12 h-[720px] max-h-[85vh] min-h-[520px]">
              {/* LEFT PANE: Conversations list (4 cols) */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900/95 max-h-[220px] sm:max-h-[260px] lg:max-h-none lg:h-full min-h-0 overflow-hidden">
                {/* Search Header */}
                <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      placeholder="Search customer, phone, or ref..."
                      className="w-full bg-slate-900 text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-slate-400">No active conversations found</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        When customers send inquiries through instant booking or WhatsApp chat, they appear here live.
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => {
                      const isSelected = selectedConvId === conv.conversationId;
                      const unread = Number(conv.unreadCount) || 0;

                      return (
                        <button
                          key={conv.conversationId}
                          onClick={() => handleSelectConversation(conv)}
                          className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950/40 border-l-4 border-emerald-500'
                              : 'hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
                            {(conv.customerName || 'C').charAt(0).toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <h4 className="text-xs font-bold text-white truncate">
                                {conv.customerName || 'Customer'}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {formatChatTime(conv.lastMessageTime)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                              {conv.customerPhone && <span>{conv.customerPhone}</span>}
                              {conv.bookingId && (
                                <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/20">
                                  #{conv.bookingId}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 truncate leading-tight">
                              {conv.lastMessageSender === 'admin' ? (
                                <span className="text-emerald-400 font-semibold">You: </span>
                              ) : null}
                              {conv.lastMessageText || 'No message text'}
                            </p>
                          </div>

                          {unread > 0 && (
                            <div className="shrink-0 bg-emerald-500 text-slate-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                              {unread}
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT PANE: Selected Conversation Chat Room (8 cols) */}
              <div className="lg:col-span-8 flex flex-col bg-slate-950/60 flex-1 lg:h-full min-h-0 relative overflow-hidden">
                {selectedConv ? (
                  <>
                    {/* Header */}
                    <div className="p-3.5 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                          {(selectedConv.customerName || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">
                              {selectedConv.customerName || 'Customer'}
                            </h4>
                            {selectedConv.bookingId && (
                              <span className="bg-purple-500/10 text-purple-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">
                                Ref: #{selectedConv.bookingId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Direct Live Channel
                            </span>
                            {selectedConv.customerPhone && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-300">{selectedConv.customerPhone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {selectedConv.customerPhone && (
                          <a
                            href={`https://wa.me/${selectedConv.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp Web</span>
                          </a>
                        )}
                        {selectedConv.bookingId && (
                          <button
                            onClick={() => {
                              setActiveTab('bookings');
                              setBookingFilterStatus('all');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-purple-400" />
                            <span className="hidden sm:inline">View Booking</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div ref={adminChatContainerRef} className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/80">
                      {chatLoading ? (
                        <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-emerald-400" />
                          <span>Loading conversation...</span>
                        </div>
                      ) : activeConvMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6">
                          <MessageSquare className="w-10 h-10 text-slate-700 mb-2" />
                          <p className="font-semibold text-slate-400">No messages in this chat yet</p>
                          <p className="text-[11px] text-slate-600 mt-1 max-w-sm">
                            Reply to the customer or select one of the quick templates below to send an instant response.
                          </p>
                        </div>
                      ) : (
                        activeConvMessages.map((msg, index) => {
                          const isAdmin = msg.senderRole === 'admin';
                          return (
                            <div
                              key={msg.id || index}
                              className={`flex flex-col max-w-[80%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                              <div
                                className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                                  isAdmin
                                    ? 'bg-emerald-600 text-white rounded-tr-none'
                                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1 font-semibold">
                                  <span>{isAdmin ? 'You (Support Admin)' : (msg.senderName || selectedConv.customerName || 'Customer')}</span>
                                </div>
                                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                                  <span>{formatChatTime(msg.createdAt)}</span>
                                  {isAdmin && (
                                    <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-sky-200' : 'text-emerald-200'}`} />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Replies Strip */}
                    <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 overflow-x-auto custom-scrollbar flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Quick:
                      </span>
                      {adminQuickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleAdminSendMessage(reply)}
                          className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all border border-slate-700/60 shrink-0 cursor-pointer"
                        >
                          {reply.length > 35 ? `${reply.slice(0, 35)}...` : reply}
                        </button>
                      ))}
                    </div>

                    {/* Message Input Box - FIXED ON BOTTOM RELATIVE TO CHATAREA DIV */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAdminSendMessage();
                      }}
                      className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.5)]"
                    >
                      <input
                        type="text"
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        placeholder={`Reply to ${selectedConv.customerName || 'customer'} as Admin...`}
                        disabled={isSendingChat}
                        className="flex-1 bg-slate-950 text-white text-xs px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isSendingChat || !chatInputText.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Live Chat Operations Desk</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Select any customer conversation from the list on the left to read their messages, answer rental inquiries, and manage bookings live.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 1: CUSTOMERS
            ---------------------------------------------------- */}
        {activeTab === 'customers' && (
          <div className="space-y-4">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Registered Customers Management</h3>
                <p className="text-xs text-slate-400">View customer profile, KYC status, bookings history, and suspend/activate accounts.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-slate-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-200"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone / Contact</th>
                    <th className="p-4">KYC Status</th>
                    <th className="p-4 text-center">Bookings Count</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-850/50">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.email}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-200">{c.phone}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.kycStatus === 'Verified'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {c.kycStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-white text-sm">{c.bookingsCount || 0}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            c.status === 'active' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleCustomerStatus(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            c.status === 'active'
                              ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800'
                              : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {c.status === 'active' ? 'Suspend Account' : 'Re-Activate Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 2: OWNERS
            ---------------------------------------------------- */}
        {activeTab === 'owners' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Registered Fleet Owners</h3>
                <p className="text-xs text-slate-400">Manage local bike hosts, verification status, active vehicle count, and payout earnings.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search owner name or phone..."
                  value={ownerSearch}
                  onChange={(e) => setOwnerSearch(e.target.value)}
                  className="w-full bg-slate-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-200"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Owner Name</th>
                    <th className="p-4">Phone / Email</th>
                    <th className="p-4">Host Verification</th>
                    <th className="p-4 text-center">Vehicles Owned</th>
                    <th className="p-4">Est. Earnings (85%)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredOwners.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-850/50">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          {o.name}
                          <VerifiedOwnerBadge />
                        </div>
                        <div className="text-[11px] text-slate-500">Joined {o.joinedDate || '2026'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-slate-200">{o.phone}</div>
                        <div className="text-[11px] text-slate-400">{o.email}</div>
                        {o.upiId ? (
                          <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                            <span className="text-slate-500">UPI:</span> {o.upiId}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">UPI: Not configured</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            o.verificationStatus === 'Verified'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {o.verificationStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-white text-sm">{o.vehiclesCount || 0}</td>
                      <td className="p-4 font-bold text-emerald-400 text-sm">₹{o.earnings || 0}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            o.status === 'active' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleOwnerStatus(o.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            o.status === 'active'
                              ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800'
                              : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {o.status === 'active' ? 'Suspend Owner' : 'Re-Activate Owner'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 3: VEHICLES (APPROVALS & ACTIONS)
            Actions required: Approve, Reject, Request changes, Suspend
            ---------------------------------------------------- */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Vehicle Fleet & Verification Hub</h3>
                <p className="text-xs text-slate-400">Review documents, pricing, availability, and execute Approve, Reject, Request changes, or Suspend actions.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <select
                  value={vehicleFilterStatus}
                  onChange={(e) => setVehicleFilterStatus(e.target.value)}
                  className="bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none w-full sm:w-auto"
                >
                  <option value="all">All Vehicles</option>
                  <option value="pending">Pending Approval</option>
                  <option value="active">Active & Live</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                  <option value="changes_requested">Changes Requested</option>
                </select>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search vehicle or owner..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full bg-slate-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredVehicles.map((veh) => {
                const hasRc = Boolean(veh.documents?.rc || veh.documents?.rcUrl);
                const hasInsurance = Boolean(veh.documents?.insurance || veh.documents?.insuranceUrl);
                const hasGovtId = Boolean(veh.documents?.governmentId || veh.documents?.governmentIdUrl || veh.documents?.governmentIdNumber);
                const hasPan = Boolean(veh.documents?.panCard || veh.documents?.panCardUrl || veh.documents?.panNumber);
                const isApproved = veh.verificationStatus === 'Verified' || Boolean(veh.vehicleVerified);

                return (
                  <div
                    key={veh.id}
                    className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg hover:border-slate-700 transition-all group"
                  >
                    {/* Clickable Vehicle Overview (Click to Inspect Documents & Photos) */}
                    <div
                      onClick={() => setInspectingVehicle(veh)}
                      className="flex flex-col sm:flex-row gap-4 items-start cursor-pointer flex-1"
                      title="Click to inspect RC, Insurance, Host Aadhaar & PAN, and 6 photos"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={veh.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'}
                          alt={veh.name}
                          className="w-full sm:w-28 h-28 object-cover rounded-xl shrink-0 border border-slate-800 group-hover:border-indigo-500/60 transition-all shadow"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-slate-950/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                          <Eye className="w-2.5 h-2.5 text-indigo-400" />
                          Audit
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-heading font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                            {veh.name}
                          </h4>
                          <span className="font-mono text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800 font-bold">
                            {veh.registrationNumber}
                          </span>
                          <span className="capitalize text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                            {veh.type}
                          </span>
                          {isApproved ? (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                            </span>
                          ) : veh.verificationStatus === 'Rejected' ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Rejected
                            </span>
                          ) : veh.verificationStatus === 'Changes Requested' ? (
                            <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Changes Requested
                            </span>
                          ) : (
                            <span className="bg-yellow-950 text-yellow-300 border border-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Pending Review
                            </span>
                          )}
                        </div>

                        <div className="text-slate-300">
                          Owner: <strong className="text-white">{veh.ownerName}</strong> ({veh.ownerPhone || 'Verified Host'})
                        </div>

                        <div className="text-slate-400">
                          Pickup: {veh.pickupAddress || veh.locationArea} • <strong className="text-emerald-400">₹{veh.dailyRate}/day</strong>
                        </div>

                        {/* Real Dynamic Document Compliance Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {/* RC Badge */}
                          {isApproved ? (
                            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RC Verified
                            </span>
                          ) : hasRc ? (
                            <span className="bg-blue-950/80 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <FileText className="w-3 h-3 text-blue-400" /> RC Attached
                            </span>
                          ) : (
                            <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400" /> RC Missing
                            </span>
                          )}

                          {/* Insurance Badge */}
                          {isApproved ? (
                            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Insurance Valid
                            </span>
                          ) : hasInsurance ? (
                            <span className="bg-blue-950/80 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <FileText className="w-3 h-3 text-blue-400" /> Insurance Attached
                            </span>
                          ) : (
                            <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400" /> Insurance Missing
                            </span>
                          )}

                          {/* Host Aadhaar & PAN KYC Badge */}
                          {isApproved || (hasGovtId && hasPan) ? (
                            <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-indigo-400" /> Host ID & PAN Attached
                            </span>
                          ) : (
                            <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-amber-400" /> Host KYC Pending
                            </span>
                          )}

                          <span className="bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded text-[10px]">
                            {veh.status === 'active' ? '🟢 Live' : '🔴 Paused'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ADMIN ACTIONS: Inspect Modal Button, Approve, Reject, Request changes, Suspend */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                      {/* Action 0: Inspect Documents & Photos */}
                      <button
                        onClick={() => setInspectingVehicle(veh)}
                        className="px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-600/30 transition-all"
                        title="Inspect RC, Insurance, Host Aadhaar & PAN, and 6 photos"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Documents & Photos
                      </button>

                      {/* Action 1: Approve */}
                      <button
                        onClick={() => verifyVehicle(veh.id, 'Verified')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default opacity-80'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>

                      {/* Action 2: Reject */}
                      <button
                        onClick={() => verifyVehicle(veh.id, 'Rejected')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          veh.verificationStatus === 'Rejected'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800 cursor-default opacity-80'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>

                      {/* Action 3: Request changes */}
                      <button
                        onClick={() => {
                          setChangeReqModalVehicle(veh);
                          setChangeReqNote('');
                        }}
                        className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Request Changes
                      </button>

                      {/* Action 4: Suspend / Reactivate */}
                      <button
                        onClick={() => toggleVehicleStatus(veh.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        {veh.status === 'active' ? 'Suspend' : 'Re-Activate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 4: BOOKINGS
            Show: Booking ID, Customer, Vehicle, Owner, Dates, Amount, Payment status, Booking status
            Admin can change booking status across 10 states.
            ---------------------------------------------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">All Booking Pipeline & Admin Status Control</h3>
                <p className="text-xs text-slate-400">Track and override booking states across the 10-step rental lifecycle or manage WhatsApp workflow.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setManualBookingModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  Record WhatsApp Booking
                </button>

                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="bg-slate-900 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none"
                >
                  <option value="all">All Booking States</option>
                  <option value="Inquiry">Inquiry</option>
                  <option value="KYC Pending">KYC Pending</option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pickup Pending">Pickup Pending</option>
                  <option value="Active Rental">Active Rental</option>
                  <option value="Return Pending">Return Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Dispute">Dispute</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Owner (Mediated)</th>
                    <th className="p-4">Dates</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Booking Status</th>
                    <th className="p-4 text-center">WhatsApp 7-Step Pipeline</th>
                    <th className="p-4 text-right">Admin Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-850/50">
                      <td className="p-4 font-mono font-bold text-white">{b.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-200">{b.vehicleName}</td>
                      <td className="p-4 text-slate-300">
                        <div>{b.ownerName}</div>
                        <span className="text-[10px] text-emerald-400 font-semibold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          Platform Mediated
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        <div>
                          {b.startDate} → {b.endDate}
                        </div>
                        <div className="text-[10px] text-slate-500">{b.totalDays} day(s)</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">₹{b.totalAmount}</td>
                      <td className="p-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedWhatsAppPipelineBooking(b)}
                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center justify-center gap-1 mx-auto"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>7-Step Workflow</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                          className="bg-slate-950 text-emerald-400 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Inquiry">Inquiry</option>
                          <option value="KYC Pending">KYC Pending</option>
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pickup Pending">Pickup Pending</option>
                          <option value="Active Rental">Active Rental</option>
                          <option value="Return Pending">Return Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Dispute">Dispute</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* ----------------------------------------------------
            SECTION 5: INSPECTIONS (BEFORE / AFTER COMPARISON)
            Show BEFORE RENTAL & AFTER RENTAL details:
            - Photos, Video, Odometer, Fuel, Damage notes
            Create a clear Before/After comparison interface.
            ---------------------------------------------------- */}
        {activeTab === 'inspections' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">Digital Inspection & Damage Audit Hub</h3>
              <p className="text-xs text-slate-400">Side-by-side Before/After rental comparison of photos, videos, odometer readings, fuel levels, and damage logs.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {bookings.map((b) => {
                const insp = inspections[b.id];
                const pre = insp?.preRental;
                const post = insp?.postRental;

                const odoDiff = pre && post ? post.odometer - pre.odometer : null;
                const fuelDiff = pre && post ? post.fuelLevel - pre.fuelLevel : null;

                return (
                  <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-white text-base">{b.id}</span>
                          <BookingStatusBadge status={b.status} />
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm mt-0.5">
                          {b.vehicleName} • <span className="text-slate-400">Customer: {b.customerName}</span>
                        </h4>
                      </div>

                      <button
                        onClick={() => setActiveDiffModal({ bookingId: b.id })}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
                      >
                        <Camera className="w-4 h-4" />
                        Launch Full Photo Diff Modal
                      </button>
                    </div>

                    {/* COMPARISON INTERFACE: BEFORE vs AFTER */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* BEFORE RENTAL CARD */}
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-extrabold px-3 py-1 rounded-lg text-xs uppercase">
                            BEFORE RENTAL (HANDOVER)
                          </span>
                          <span className="text-[10px] text-slate-400">{pre?.inspectedAt || 'Pending'}</span>
                        </div>

                        {pre ? (
                          <div className="space-y-3 text-xs">
                            {/* Odometer & Fuel */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <div>
                                <span className="text-slate-500 block text-[10px]">Odometer</span>
                                <strong className="text-white text-sm font-mono">{pre.odometer} km</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">Fuel Level</span>
                                <strong className="text-emerald-400 text-sm">{pre.fuelLevel}%</strong>
                              </div>
                            </div>

                            {/* Damage Notes & Video */}
                            <div className="space-y-1 bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-400 font-bold text-[11px] block">Damage Notes:</span>
                              <p className="text-slate-200 italic">{pre.existingDamage || 'No scratch logged.'}</p>
                              <div className="pt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> Walkaround Video Recorded & Verified
                              </div>
                            </div>

                            {/* Inspection Photos Thumbnails */}
                            <div>
                              <span className="text-slate-400 font-bold text-[11px] block mb-2">Pre-Rental Photos:</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { label: 'Front', url: pre.frontPhoto },
                                  { label: 'Rear', url: pre.rearPhoto },
                                  { label: 'Dashboard', url: pre.dashboardPhoto }
                                ].map(
                                  (img, idx) =>
                                    img.url && (
                                      <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-800 aspect-video">
                                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] px-1 rounded">
                                          {img.label}
                                        </span>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-500 text-xs italic">
                            Pre-rental inspection photo check pending at vehicle pickup.
                          </div>
                        )}
                      </div>

                      {/* AFTER RENTAL CARD */}
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-blue-950 text-blue-400 border border-blue-800 font-extrabold px-3 py-1 rounded-lg text-xs uppercase">
                            AFTER RENTAL (RETURN)
                          </span>
                          <span className="text-[10px] text-slate-400">{post?.inspectedAt || 'Pending'}</span>
                        </div>

                        {post ? (
                          <div className="space-y-3 text-xs">
                            {/* Odometer & Fuel */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <div>
                                <span className="text-slate-500 block text-[10px]">Odometer</span>
                                <strong className="text-white text-sm font-mono">{post.odometer} km</strong>
                                {odoDiff !== null && (
                                  <span className="text-[10px] text-emerald-400 font-semibold block">+{odoDiff} km ridden</span>
                                )}
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px]">Fuel Level</span>
                                <strong className="text-amber-400 text-sm">{post.fuelLevel}%</strong>
                                {fuelDiff !== null && (
                                  <span className="text-[10px] text-amber-400 font-semibold block">{fuelDiff}% diff</span>
                                )}
                              </div>
                            </div>

                            {/* Damage Notes & Video */}
                            <div className="space-y-1 bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-400 font-bold text-[11px] block">Damage Notes:</span>
                              <p className="text-slate-200 italic">{post.existingDamage || 'Clean return logged.'}</p>
                              <div className="pt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> Return Walkaround Video Logged
                              </div>
                            </div>

                            {/* Inspection Photos Thumbnails */}
                            <div>
                              <span className="text-slate-400 font-bold text-[11px] block mb-2">Post-Rental Photos:</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { label: 'Front', url: post.frontPhoto },
                                  { label: 'Rear', url: post.rearPhoto },
                                  { label: 'Dashboard', url: post.dashboardPhoto }
                                ].map(
                                  (img, idx) =>
                                    img.url && (
                                      <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-800 aspect-video">
                                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] px-1 rounded">
                                          {img.label}
                                        </span>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-500 text-xs italic">
                            Post-rental return inspection pending. Vehicle currently on active rental.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 6: DISPUTES
            Allow admin to:
            - Open dispute, Add notes, Upload evidence, Review inspection, Mark resolved, Record outcome
            ---------------------------------------------------- */}
        {activeTab === 'disputes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Rental Disputes & Claim Audit</h3>
                <p className="text-xs text-slate-400">Review inspection evidence, communicate with parties, record resolution outcomes.</p>
              </div>

              <button
                onClick={() => setNewDisputeModal(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                Open New Dispute
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {disputes.map((d) => (
                <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-rose-400 text-sm">{d.id}</span>
                      <span className="text-slate-400 text-xs font-bold">Booking: #{d.bookingId}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          d.status === 'Open' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500">Opened: {d.createdAt}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold">Parties Involved</span>
                      <p className="text-slate-200 font-semibold mt-0.5">
                        Customer: <span className="text-white">{d.customerName}</span>
                      </p>
                      <p className="text-slate-200 font-semibold">
                        Host Owner: <span className="text-white">{d.ownerName}</span>
                      </p>
                      <p className="text-slate-400 text-[11px] mt-1">{d.vehicleName}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-bold">Issue Description</span>
                      <p className="text-slate-200 mt-0.5 italic">{d.issue}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-bold">Outcome Record</span>
                      <p className="text-emerald-400 font-semibold mt-0.5">
                        {d.outcome || 'Pending resolution review by admin'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setActiveDiffModal({ bookingId: d.bookingId })}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-semibold flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      Review Inspection
                    </button>

                    <button
                      onClick={() => setSelectedDisputeModal(d)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs px-4 py-1.5 rounded-xl font-extrabold flex items-center gap-1 shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      View Notes & Resolve Dispute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 7: PAYMENTS
            Show: Customer payment, Platform commission, Owner payout, Payment status, Refund status
            ---------------------------------------------------- */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">Platform Payments & Financial Ledger</h3>
              <p className="text-xs text-slate-400">Detailed breakdown of customer rental payments, platform commission (15%), owner payouts (85%), and refunds.</p>
            </div>

            {/* Financial Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Total Customer Payments</span>
                <strong className="text-emerald-400 text-xl font-extrabold mt-1 block">₹{grossBookingValue}</strong>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Platform Commission ({adminSettings.platformCommission || 15}%)</span>
                <strong className="text-amber-400 text-xl font-extrabold mt-1 block">₹{platformCommissionAmount}</strong>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Total Owner Payouts (85%)</span>
                <strong className="text-blue-400 text-xl font-extrabold mt-1 block">
                  ₹{grossBookingValue - platformCommissionAmount}
                </strong>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-xs block">Processed Refunds</span>
                <strong className="text-rose-400 text-xl font-extrabold mt-1 block">₹0</strong>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer Payment</th>
                    <th className="p-4">Platform Commission (15%)</th>
                    <th className="p-4">Owner Payout (85%)</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Refund Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map((b) => {
                    const isPaid = b.paymentStatus === 'Paid';
                    const comm = Math.round(b.totalAmount * 0.15);
                    const payout = b.totalAmount - comm;

                    return (
                      <tr key={b.id} className="hover:bg-slate-850/50">
                        <td className="p-4 font-mono font-bold text-white">
                          #{b.id}
                          <div className="text-[10px] text-slate-500">{b.customerName}</div>
                        </td>
                        <td className="p-4 font-bold text-white text-sm">₹{b.totalAmount}</td>
                        <td className="p-4 font-bold text-amber-400">₹{comm}</td>
                        <td className="p-4 font-bold text-emerald-400">₹{payout}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPaid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{b.refundStatus || 'None'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              updatePaymentStatus(b.id, 'Paid', null, 'Full Refunded');
                              alert(`Refund processed for ${b.id}`);
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold border border-slate-700"
                          >
                            Issue Refund
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 8: SETTINGS
            Allow admin to configure:
            - Platform commission
            - Rental rules
            - Cancellation rules
            - Protection information
            - WhatsApp number
            - Support contact
            - Minimum rental duration
            ---------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-3xl space-y-6 shadow-xl">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white">Platform Settings & Policy Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">Configure global platform rules, commission rates, protection text, and support channels.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Platform Commission Rate (%)</label>
                  <input
                    type="number"
                    value={settingsForm.platformCommission}
                    onChange={(e) => setSettingsForm({ ...settingsForm, platformCommission: Number(e.target.value) })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Minimum Rental Duration</label>
                  <select
                    value={settingsForm.minRentalDuration}
                    onChange={(e) => setSettingsForm({ ...settingsForm, minRentalDuration: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="4 Hours">4 Hours</option>
                    <option value="1 Day">1 Day</option>
                    <option value="2 Days">2 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Support WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsAppNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsAppNumber: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Support Email Contact</label>
                  <input
                    type="email"
                    value={settingsForm.supportContact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportContact: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Standard Rental Rules</label>
                <textarea
                  rows={3}
                  value={settingsForm.rentalRules}
                  onChange={(e) => setSettingsForm({ ...settingsForm, rentalRules: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Cancellation Rules & Terms</label>
                <textarea
                  rows={3}
                  value={settingsForm.cancellationRules}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cancellationRules: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Protection Information & Disclaimer</label>
                <textarea
                  rows={3}
                  value={settingsForm.protectionInfo}
                  onChange={(e) => setSettingsForm({ ...settingsForm, protectionInfo: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs py-3 px-6 rounded-xl shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Platform Settings
              </button>
            </form>

            {/* Database Export & Backup Card */}
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5 space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Download Live SQLite Database (.db)</h4>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      Download a live, point-in-time copy of the SQLite database (<code className="text-purple-300 font-mono">vrindavan.db</code>) running on Render or your local server. Includes all verified customers, fleet hosts, vehicle listings, booking vouchers, and inspection records.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('vr_token') || localStorage.getItem('vr_admin_token') || '';
                    const baseApi = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '/api';
                    const downloadUrl = `${baseApi}/settings/download-db?token=${encodeURIComponent(token)}`;
                    window.open(downloadUrl, '_blank');
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Live Database File</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION 9: FUTURE STRATEGY
            ---------------------------------------------------- */}
        {activeTab === 'strategy' && <AdminStrategyView />}
      </div>

      {/* ----------------------------------------------------
          MODAL: OPEN NEW DISPUTE
          ---------------------------------------------------- */}
      {newDisputeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-heading font-extrabold text-lg text-white">Open New Dispute</h3>

            <form onSubmit={handleCreateDispute} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Booking ID</label>
                <select
                  value={newDisputeBookingId}
                  onChange={(e) => setNewDisputeBookingId(e.target.value)}
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Booking --</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      #{b.id} - {b.vehicleName} ({b.customerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Dispute Reason / Issue Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe damage disparity, fuel shortage, or late return..."
                  value={newDisputeIssue}
                  onChange={(e) => setNewDisputeIssue(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none"
                  required
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewDisputeModal(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-2.5 rounded-xl shadow"
                >
                  Open Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: DISPUTE DETAILS & NOTES
          ---------------------------------------------------- */}
      {selectedDisputeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Dispute Case #{selectedDisputeModal.id}</h3>
                <p className="text-xs text-slate-400">Booking Ref: #{selectedDisputeModal.bookingId}</p>
              </div>

              <button
                onClick={() => setSelectedDisputeModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 p-2 rounded-xl"
              >
                ✕ Close
              </button>
            </div>

            {/* Communication log */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-300">Notes Timeline:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                {selectedDisputeModal.notes.map((n, i) => (
                  <div key={i} className="border-b border-slate-900 pb-2 last:border-0">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <strong className="text-emerald-400">{n.sender}</strong>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-slate-200 mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add note */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Type admin internal note..."
                value={disputeNoteText}
                onChange={(e) => setDisputeNoteText(e.target.value)}
                className="flex-1 bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-4 rounded-xl">
                Add Note
              </button>
            </form>

            {/* Record Outcome & Mark Resolved */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300">Record Final Outcome & Compensation:</label>
              <input
                type="text"
                placeholder="e.g. ₹500 repair deducted from deposit, owner paid remaining ₹1300."
                value={disputeOutcomeText}
                onChange={(e) => setDisputeOutcomeText(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveDispute(disputeOutcomeText || 'Customer Refunded & Case Closed')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow"
                >
                  Mark Case as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: REQUEST CHANGES FOR VEHICLE
          ---------------------------------------------------- */}
      {changeReqModalVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-heading font-extrabold text-lg text-white">Request Changes from Owner</h3>
            <p className="text-xs text-slate-400">
              Vehicle: <strong className="text-white">{changeReqModalVehicle.name}</strong> ({changeReqModalVehicle.ownerName})
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Please upload clear RC photo without glare and update registration expiry date..."
              value={changeReqNote}
              onChange={(e) => setChangeReqNote(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none"
            ></textarea>

            <div className="flex gap-2">
              <button
                onClick={() => setChangeReqModalVehicle(null)}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  verifyVehicle(changeReqModalVehicle.id, 'Changes Requested');
                  setChangeReqModalVehicle(null);
                  alert('📩 Change Request sent to host!');
                }}
                className="w-1/2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs shadow"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: RECORD MANUAL WHATSAPP BOOKING
          ---------------------------------------------------- */}
      {manualBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Record Manual WhatsApp Booking</h3>
                <p className="text-xs text-slate-400">Log an incoming WhatsApp booking request manually into platform records.</p>
              </div>
              <button onClick={() => setManualBookingModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 p-1.5 rounded-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Chandra"
                    value={manualCustomerName}
                    onChange={(e) => setManualCustomerName(e.target.value)}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer WhatsApp Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98123 45678"
                    value={manualCustomerPhone}
                    onChange={(e) => setManualCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Vehicle Requested</label>
                <select
                  value={manualVehicleId}
                  onChange={(e) => setManualVehicleId(e.target.value)}
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 focus:outline-none"
                  required
                >
                  <option value="">-- Select Fleet Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.registrationNumber}) - ₹{v.dailyRate}/day (Owner: {v.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={manualEndDate}
                    onChange={(e) => setManualEndDate(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setManualBookingModalOpen(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-3 rounded-xl shadow"
                >
                  Create & Record Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: 7-STEP ADMIN WHATSAPP ACTION PIPELINE
          ---------------------------------------------------- */}
      {selectedWhatsAppPipelineBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-lg text-white">7-Step WhatsApp Booking Pipeline</h3>
                  <span className="font-mono text-emerald-400 font-extrabold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-xs">
                    #{selectedWhatsAppPipelineBooking.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customer: <strong className="text-white">{selectedWhatsAppPipelineBooking.customerName}</strong> ({selectedWhatsAppPipelineBooking.customerPhone})
                </p>
              </div>

              <button
                onClick={() => setSelectedWhatsAppPipelineBooking(null)}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 p-2 rounded-xl"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Vehicle Requested:</span>
                <strong className="text-white">{selectedWhatsAppPipelineBooking.vehicleName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Dates & Duration:</span>
                <strong className="text-emerald-400">{selectedWhatsAppPipelineBooking.startDate} → {selectedWhatsAppPipelineBooking.endDate} ({selectedWhatsAppPipelineBooking.totalDays} days)</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <strong className="text-emerald-400">₹{selectedWhatsAppPipelineBooking.totalAmount}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-850">
                <span>Current Booking Status:</span>
                <BookingStatusBadge status={selectedWhatsAppPipelineBooking.status} />
              </div>
            </div>

            {/* 7 Interactive Steps List */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs text-slate-300">Execute Sequential Admin Steps:</h4>

              {/* Step 1: Confirm availability */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">1. Confirm Availability</span>
                  <span className="text-[11px] text-slate-400">Verify bike is clear for requested dates.</span>
                </div>
                <button
                  onClick={() => handleStep1ConfirmAvailability(selectedWhatsAppPipelineBooking)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0"
                >
                  1. Confirm Availability
                </button>
              </div>

              {/* Step 2: Verify customer */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">2. Verify Customer KYC</span>
                  <span className="text-[11px] text-slate-400">Verify Aadhaar & DL submitted on WhatsApp.</span>
                </div>
                <button
                  onClick={() => handleStep2VerifyCustomer(selectedWhatsAppPipelineBooking)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0"
                >
                  2. Verify Customer
                </button>
              </div>

              {/* Step 3: Confirm rental price */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">3. Confirm Rental Price</span>
                  <span className="text-[11px] text-slate-400">Verify ₹{selectedWhatsAppPipelineBooking.totalAmount} rental calculation.</span>
                </div>
                <button
                  onClick={() => handleStep3ConfirmPrice(selectedWhatsAppPipelineBooking)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0"
                >
                  3. Confirm Price
                </button>
              </div>

              {/* Step 4: Send payment link */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">4. Send Payment Link</span>
                  <span className="text-[11px] text-slate-400">Copy & launch WhatsApp UPI/card link message.</span>
                </div>
                <button
                  onClick={() => handleStep4SendPaymentLink(selectedWhatsAppPipelineBooking)}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                  4. Send Link
                </button>
              </div>

              {/* Step 5: Mark payment as received */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">5. Mark Payment Received</span>
                  <span className="text-[11px] text-slate-400">Set payment status to Paid and booking to Confirmed.</span>
                </div>
                <button
                  onClick={() => handleStep5MarkPaymentReceived(selectedWhatsAppPipelineBooking)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0"
                >
                  5. Payment Received
                </button>
              </div>

              {/* Step 6: Confirm booking */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">6. Confirm Booking</span>
                  <span className="text-[11px] text-slate-400">Issue official platform booking ref #{selectedWhatsAppPipelineBooking.id}.</span>
                </div>
                <button
                  onClick={() => handleStep6ConfirmBooking(selectedWhatsAppPipelineBooking)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0"
                >
                  6. Confirm Booking
                </button>
              </div>

              {/* Step 7: Send pickup instructions */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">7. Send Pickup Instructions</span>
                  <span className="text-[11px] text-slate-400">Send pickup address & platform support note (no owner phone).</span>
                </div>
                <button
                  onClick={() => handleStep7SendPickupInstructions(selectedWhatsAppPipelineBooking)}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                  7. Send Instructions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: VEHICLE & HOST COMPLIANCE DOCUMENT AUDIT
          Opens when admin clicks on any vehicle card or 'Inspect Documents & Photos'
          ---------------------------------------------------- */}
      {inspectingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-sans animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-lg text-white">
                      Vehicle & Host Compliance Document Audit
                    </h3>
                    <span className="font-mono text-emerald-400 font-extrabold bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 text-xs">
                      {inspectingVehicle.registrationNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fleet ID: #{inspectingVehicle.id} • {inspectingVehicle.name} • {inspectingVehicle.type}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingVehicle(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title="Close Audit Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Audit Content */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
              {/* Host Overview & Verification Status Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Host / Owner:</span>
                    <strong className="text-white text-sm">{inspectingVehicle.ownerName}</strong>
                    {inspectingVehicle.ownerVerified ? (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> KYC Verified Host
                      </span>
                    ) : (
                      <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-400" /> Pending Admin Approval
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Phone: <strong className="text-slate-200">{inspectingVehicle.ownerPhone || 'N/A'}</strong></span>
                    <span>Email: <strong className="text-slate-200">{inspectingVehicle.ownerEmail || 'N/A'}</strong></span>
                    <span>City: <strong className="text-slate-200">{inspectingVehicle.ownerCity || inspectingVehicle.city || 'Vrindavan'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${(inspectingVehicle.ownerPhone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-[#25D366]" />
                    WhatsApp Host
                  </a>
                  {inspectingVehicle.ownerPhone && (
                    <a
                      href={`tel:${inspectingVehicle.ownerPhone}`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------
                  SECTION 1: HOST IDENTITY & TAX KYC DOCUMENTS
                  (Aadhaar / Government ID + PAN Card)
                  ------------------------------------------------ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-extrabold text-white text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    1. Host Identity & Tax Documents (Aadhaar & PAN Verification)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    UIDAI & Income Tax Compliance Record
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Document 1: Government Photo ID (Aadhaar) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {inspectingVehicle.documents?.governmentIdType || 'Government ID (Aadhaar)'}
                          </span>
                          <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Host Identity
                          </span>
                        </div>
                        {inspectingVehicle.documents?.governmentIdUrl || inspectingVehicle.documents?.governmentId ? (
                          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Document Number:</span>
                          <strong className="font-mono text-white text-xs">
                            {inspectingVehicle.documents?.governmentIdNumber || 'Not provided'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">File Name:</span>
                          <span className="text-slate-300 truncate max-w-[200px]" title={inspectingVehicle.documents?.governmentId}>
                            {inspectingVehicle.documents?.governmentId || 'Aadhaar_Document'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Document Preview */}
                      <div className="pt-2">
                        {inspectingVehicle.documents?.governmentIdUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                            <img
                              src={inspectingVehicle.documents.governmentIdUrl}
                              alt="Host Government ID"
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `${inspectingVehicle.documents?.governmentIdType || 'Host Government ID'} - ${inspectingVehicle.ownerName}`,
                                  url: inspectingVehicle.documents.governmentIdUrl
                                })
                              }
                            />
                            <div
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `${inspectingVehicle.documents?.governmentIdType || 'Host Government ID'} - ${inspectingVehicle.ownerName}`,
                                  url: inspectingVehicle.documents.governmentIdUrl
                                })
                              }
                              className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-white font-bold text-xs"
                            >
                              <Maximize2 className="w-4 h-4 text-emerald-400" />
                              <span>Click to Inspect Full Screen</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-4 text-center text-slate-400">
                            <FileText className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                            <p className="font-medium text-slate-300">
                              {inspectingVehicle.documents?.governmentId || 'Government ID file registered on account'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              ID Number: {inspectingVehicle.documents?.governmentIdNumber || 'Verified on file'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {inspectingVehicle.documents?.governmentIdUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setInspectDocPreview({
                              title: `${inspectingVehicle.documents?.governmentIdType || 'Host Government ID'} - ${inspectingVehicle.ownerName}`,
                              url: inspectingVehicle.documents.governmentIdUrl
                            })
                          }
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Document Full Size
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Document 2: PAN Card */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Permanent Account Number (PAN)</span>
                          <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Tax Compliance
                          </span>
                        </div>
                        {inspectingVehicle.documents?.panCardUrl || inspectingVehicle.documents?.panCard ? (
                          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">PAN Number:</span>
                          <strong className="font-mono text-emerald-400 text-xs tracking-wider">
                            {inspectingVehicle.documents?.panNumber || 'Not provided'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">File Name:</span>
                          <span className="text-slate-300 truncate max-w-[200px]" title={inspectingVehicle.documents?.panCard}>
                            {inspectingVehicle.documents?.panCard || 'PAN_Card'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Document Preview */}
                      <div className="pt-2">
                        {inspectingVehicle.documents?.panCardUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                            <img
                              src={inspectingVehicle.documents.panCardUrl}
                              alt="Host PAN Card"
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `PAN Card - ${inspectingVehicle.ownerName} (${inspectingVehicle.documents?.panNumber || ''})`,
                                  url: inspectingVehicle.documents.panCardUrl
                                })
                              }
                            />
                            <div
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `PAN Card - ${inspectingVehicle.ownerName} (${inspectingVehicle.documents?.panNumber || ''})`,
                                  url: inspectingVehicle.documents.panCardUrl
                                })
                              }
                              className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-white font-bold text-xs"
                            >
                              <Maximize2 className="w-4 h-4 text-emerald-400" />
                              <span>Click to Inspect Full Screen</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-4 text-center text-slate-400">
                            <CreditCard className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                            <p className="font-medium text-slate-300">
                              {inspectingVehicle.documents?.panCard || 'PAN Card record on file'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              PAN: {inspectingVehicle.documents?.panNumber || 'Verified on file'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      {inspectingVehicle.documents?.panCardUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setInspectDocPreview({
                              title: `PAN Card - ${inspectingVehicle.ownerName} (${inspectingVehicle.documents?.panNumber || ''})`,
                              url: inspectingVehicle.documents.panCardUrl
                            })
                          }
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View PAN Full Size
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-3 text-[11px] text-indigo-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Single-Time Verification Guarantee:</strong> Once approved, {inspectingVehicle.ownerName}&apos;s Aadhaar & PAN will be permanently validated. Subsequent vehicles added by this host will not prompt them for ID/PAN re-upload.
                  </span>
                </div>
              </div>

              {/* ------------------------------------------------
                  SECTION 2: VEHICLE COMPLIANCE DOCUMENTS
                  (RC + Insurance + Permits)
                  ------------------------------------------------ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-extrabold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    2. Vehicle Legal Compliance Documents (RC & Insurance)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    MoRTH Parivahan & IRDAI Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* RC Document */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Registration Certificate (RC)</span>
                          <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            UP 85
                          </span>
                        </div>
                        {inspectingVehicle.documents?.rcUrl || inspectingVehicle.documents?.rc ? (
                          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold text-[11px] flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Not Found
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Registration Number:</span>
                          <strong className="font-mono text-cyan-400 text-xs">
                            {inspectingVehicle.registrationNumber}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">File Document:</span>
                          <span className="text-slate-300 truncate max-w-[200px]">
                            {inspectingVehicle.documents?.rc || 'Vehicle_RC.pdf'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {inspectingVehicle.documents?.rcUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                            <img
                              src={inspectingVehicle.documents.rcUrl}
                              alt="Vehicle RC Document"
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `RC Document - ${inspectingVehicle.registrationNumber} (${inspectingVehicle.name})`,
                                  url: inspectingVehicle.documents.rcUrl
                                })
                              }
                            />
                            <div
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `RC Document - ${inspectingVehicle.registrationNumber} (${inspectingVehicle.name})`,
                                  url: inspectingVehicle.documents.rcUrl
                                })
                              }
                              className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-white font-bold text-xs"
                            >
                              <Maximize2 className="w-4 h-4 text-cyan-400" />
                              <span>Click to Inspect Full Screen</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-4 text-center text-slate-400">
                            <FileText className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                            <p className="font-medium text-slate-300">
                              {inspectingVehicle.documents?.rc || 'Registration Certificate Document on file'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Reg: {inspectingVehicle.registrationNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      {inspectingVehicle.documents?.rcUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setInspectDocPreview({
                              title: `RC Document - ${inspectingVehicle.registrationNumber} (${inspectingVehicle.name})`,
                              url: inspectingVehicle.documents.rcUrl
                            })
                          }
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View RC Full Size
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Insurance Certificate */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Insurance Policy Certificate</span>
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Comprehensive
                          </span>
                        </div>
                        {inspectingVehicle.documents?.insuranceUrl || inspectingVehicle.documents?.insurance ? (
                          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold text-[11px] flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Not Found
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Coverage Status:</span>
                          <strong className="text-emerald-400 text-xs">Valid for Vrindavan & Mathura</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">File Document:</span>
                          <span className="text-slate-300 truncate max-w-[200px]">
                            {inspectingVehicle.documents?.insurance || 'Insurance_Policy.pdf'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {inspectingVehicle.documents?.insuranceUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                            <img
                              src={inspectingVehicle.documents.insuranceUrl}
                              alt="Vehicle Insurance Certificate"
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `Insurance Policy - ${inspectingVehicle.name} (${inspectingVehicle.registrationNumber})`,
                                  url: inspectingVehicle.documents.insuranceUrl
                                })
                              }
                            />
                            <div
                              onClick={() =>
                                setInspectDocPreview({
                                  title: `Insurance Policy - ${inspectingVehicle.name} (${inspectingVehicle.registrationNumber})`,
                                  url: inspectingVehicle.documents.insuranceUrl
                                })
                              }
                              className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-white font-bold text-xs"
                            >
                              <Maximize2 className="w-4 h-4 text-emerald-400" />
                              <span>Click to Inspect Full Screen</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-4 text-center text-slate-400">
                            <FileText className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                            <p className="font-medium text-slate-300">
                              {inspectingVehicle.documents?.insurance || 'Vehicle Insurance Policy Document on file'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Verified Comprehensive Coverage
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      {inspectingVehicle.documents?.insuranceUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setInspectDocPreview({
                              title: `Insurance Policy - ${inspectingVehicle.name} (${inspectingVehicle.registrationNumber})`,
                              url: inspectingVehicle.documents.insuranceUrl
                            })
                          }
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Insurance Full Size
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------
                  SECTION 3: 6-ANGLE VEHICLE INSPECTION PHOTOS
                  ------------------------------------------------ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-extrabold text-white text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    3. 6-Angle Vehicle Inspection Gallery
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Front, Rear, Sides, Odometer & Damage Check
                  </span>
                </div>

                {(() => {
                  const anglePhotos = [
                    { label: '1. Front View', url: inspectingVehicle.photos?.front || inspectingVehicle.images?.[0] },
                    { label: '2. Rear View', url: inspectingVehicle.photos?.rear || inspectingVehicle.images?.[1] },
                    { label: '3. Left Side', url: inspectingVehicle.photos?.left || inspectingVehicle.images?.[2] },
                    { label: '4. Right Side', url: inspectingVehicle.photos?.right || inspectingVehicle.images?.[3] },
                    { label: '5. Dashboard & Odometer', url: inspectingVehicle.photos?.dashboard || inspectingVehicle.images?.[4] },
                    { label: '6. Damage / Scratch Check', url: inspectingVehicle.photos?.damageCloseUp || inspectingVehicle.images?.[5] }
                  ];

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {anglePhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            photo.url &&
                            setInspectDocPreview({
                              title: `${photo.label} - ${inspectingVehicle.name} (${inspectingVehicle.registrationNumber})`,
                              url: photo.url
                            })
                          }
                          className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-2 group hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                            {photo.url ? (
                              <>
                                <img
                                  src={photo.url}
                                  alt={photo.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                              </>
                            ) : (
                              <div className="text-center p-2 text-slate-600">
                                <Camera className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                <span className="text-[10px] block">No Photo</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-300 block text-center pt-2 truncate" title={photo.label}>
                            {photo.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ------------------------------------------------
                  SECTION 4: VEHICLE SPECS & PRICING SUMMARY
                  ------------------------------------------------ */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <h4 className="font-heading font-extrabold text-white text-xs flex items-center gap-2">
                  <Bike className="w-4 h-4 text-emerald-400" />
                  Vehicle Specifications & Onboarding Data
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Make & Model</span>
                    <strong className="text-white">{inspectingVehicle.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Year & Fuel</span>
                    <strong className="text-white">{inspectingVehicle.year || '2024'} • {inspectingVehicle.fuelType || 'Petrol'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Daily Rental Rate</span>
                    <strong className="text-emerald-400 font-extrabold">₹{inspectingVehicle.dailyRate}/day</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Location</span>
                    <span className="text-slate-200 truncate block">{inspectingVehicle.pickupAddress || inspectingVehicle.locationArea || 'Prem Mandir, Vrindavan'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400">
                Current Status:{' '}
                <strong className="text-white capitalize">
                  {inspectingVehicle.verificationStatus || inspectingVehicle.status}
                </strong>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Action 1: Approve Vehicle & Mark Host KYC Verified */}
                <button
                  type="button"
                  onClick={() => {
                    verifyVehicle(inspectingVehicle.id, 'Verified');
                    setInspectingVehicle((prev) => (prev ? { ...prev, verificationStatus: 'Verified', vehicleVerified: true, status: 'active' } : prev));
                    alert(`✅ Vehicle "${inspectingVehicle.name}" (${inspectingVehicle.registrationNumber}) and Host KYC have been Approved & Activated!`);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Vehicle & Host KYC
                </button>

                {/* Action 2: Request Changes */}
                <button
                  type="button"
                  onClick={() => {
                    setChangeReqModalVehicle(inspectingVehicle);
                    setChangeReqNote('');
                    setInspectingVehicle(null);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Request Changes
                </button>

                {/* Action 3: Reject */}
                <button
                  type="button"
                  onClick={() => {
                    verifyVehicle(inspectingVehicle.id, 'Rejected');
                    setInspectingVehicle((prev) => (prev ? { ...prev, verificationStatus: 'Rejected', status: 'rejected' } : prev));
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>

                {/* Action 4: Suspend / Reactivate */}
                <button
                  type="button"
                  onClick={() => {
                    toggleVehicleStatus(inspectingVehicle.id);
                    setInspectingVehicle((prev) => (prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : prev));
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  {inspectingVehicle.status === 'active' ? 'Suspend' : 'Re-Activate'}
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setInspectingVehicle(null)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          SUB-MODAL: FULL-RESOLUTION DOCUMENT & PHOTO LIGHTBOX
          ---------------------------------------------------- */}
      {inspectDocPreview && (
        <div className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
          <div className="max-w-4xl w-full max-h-[95vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="font-heading font-extrabold text-sm text-white truncate max-w-[80%]">
                {inspectDocPreview.title}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={inspectDocPreview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  New Tab
                </a>
                <button
                  onClick={() => setInspectDocPreview(null)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center bg-slate-950 overflow-auto">
              <img
                src={inspectDocPreview.url}
                alt={inspectDocPreview.title}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

