// Production Initial Data for Rent to Cent P2P Platform
// All collections start completely clean for production hosting.

export const INITIAL_VEHICLES = [];
export const INITIAL_BOOKINGS = [];
export const INITIAL_INSPECTIONS = {};
export const INITIAL_CUSTOMERS = [];
export const INITIAL_OWNERS = [];
export const INITIAL_DISPUTES = [];

export const INITIAL_ADMIN_SETTINGS = {
  platformCommission: 15,
  minRentalDuration: '1 Day',
  whatsAppNumber: '+919837144520',
  supportContact: 'support@rentoncent.bond',
  protectionInfo: 'Sacred Yatra Shield protection covers 3rd-party liability & accidental damage subject to verified handover audit.',
  rentalRules: '1. Valid Driving Licence required for motorized vehicles.\n2. Helmets mandatory for both rider & pillion.\n3. No honking near Prem Mandir & Nidhivan silence zones.\n4. Max Speed: 40 km/h inside temple galis.',
  cancellationRules: '1. Free cancellation up to 6 hours before pickup.\n2. 50% refund for cancellations within 6 hours of pickup.\n3. Non-refundable once trip starts.'
};

export const INITIAL_LEGAL_CONFIG = {
  protectionTitle: '🪶 Radhe Protection Plan (Sacred Yatra Shield)',
  protectionDisclaimer: 'Peer-to-peer vehicle sharing protection covers third-party liability and accidental damage subject to verified handover inspection. This is not a substitute for standard motor insurance.',
  legalPolicyNote: 'IMPORTANT LEGAL NOTICE: Regulatory guidelines for peer-to-peer motor vehicle sharing operate under owner authorization & verified documents (RC, Commercial/Self-drive permit where applicable). Rent on Cent acts as a platform connecting local owners and pilgrims.',
  citiesAvailable: ['Vrindavan', 'Mathura'],
  supportWhatsApp: '+919876543210'
};
