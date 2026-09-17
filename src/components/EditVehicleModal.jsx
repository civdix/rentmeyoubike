import React, { useState, useEffect } from 'react';
import {
  X, Save, Loader2, AlertCircle, IndianRupee, MapPin, Calendar,
  Shield, Check, Bike, HelpCircle, Wrench, Sparkles, BatteryCharging
} from 'lucide-react';
import { HelmetsIcon, OdometerGaugeIcon } from './CustomIcons';

const LOCATION_AREAS = [
  'Prem Mandir Road',
  'Raman Reti',
  'ISKCON Temple Road',
  'Bankey Bihari Temple Gali',
  'Mathura Junction Railway Station',
  'Chhatikara Road',
  'Bhaktivedanta Swami Marg',
  'Vrindavan Bus Stand',
  'Nidhivan Area',
  'Goverdhan Chauraha (Mathura)'
];

const COMMON_FEATURES = [
  'USB Mobile Charging',
  'Phone Mount Holder',
  'Sanitized Tilak Liners',
  'Rear Luggage Carrier',
  'Tubeless Tyres',
  'Side Stand Sensor',
  'First Aid Kit',
  'All-India Permit / Self-Drive'
];

export const EditVehicleModal = ({ vehicle, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    variant: '',
    year: 2024,
    registrationNumber: '',
    dailyRate: 400,
    hourlyRate: 60,
    depositAmount: 0,
    locationArea: 'Prem Mandir Road',
    pickupAddress: '',
    availabilityFrom: '',
    availabilityTo: '',
    helmetIncluded: true,
    helmetsProvided: 2,
    odometer: 10000,
    fuelType: 'Petrol',
    isEV: false,
    evRangeKm: 0,
    nearbyChargingStations: '',
    features: [],
    rentalRules: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (vehicle && isOpen) {
      let parsedFeatures = [];
      if (Array.isArray(vehicle.features)) {
        parsedFeatures = vehicle.features;
      } else if (typeof vehicle.features === 'string') {
        try {
          parsedFeatures = JSON.parse(vehicle.features);
        } catch {
          parsedFeatures = vehicle.features.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }

      let parsedRules = '';
      if (Array.isArray(vehicle.rentalRules)) {
        parsedRules = vehicle.rentalRules.join('\n');
      } else if (typeof vehicle.rentalRules === 'string') {
        try {
          const arr = JSON.parse(vehicle.rentalRules);
          parsedRules = Array.isArray(arr) ? arr.join('\n') : vehicle.rentalRules;
        } catch {
          parsedRules = vehicle.rentalRules;
        }
      }

      let availFrom = '';
      let availTo = '';
      if (vehicle.availability) {
        if (typeof vehicle.availability === 'object') {
          availFrom = vehicle.availability.from || '';
          availTo = vehicle.availability.to || '';
        } else if (typeof vehicle.availability === 'string') {
          try {
            const parsed = JSON.parse(vehicle.availability);
            availFrom = parsed.from || '';
            availTo = parsed.to || '';
          } catch {
            // ignore
          }
        }
      }

      setFormData({
        name: vehicle.name || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        variant: vehicle.variant || '',
        year: vehicle.year || 2024,
        registrationNumber: vehicle.registrationNumber || '',
        dailyRate: vehicle.dailyRate || 400,
        hourlyRate: vehicle.hourlyRate || 60,
        depositAmount: vehicle.depositAmount || 0,
        locationArea: vehicle.locationArea || 'Prem Mandir Road',
        pickupAddress: vehicle.pickupAddress || '',
        availabilityFrom: availFrom,
        availabilityTo: availTo,
        helmetIncluded: vehicle.helmetIncluded !== false,
        helmetsProvided: vehicle.helmetsProvided || 2,
        odometer: vehicle.odometer || 10000,
        fuelType: vehicle.fuelType || 'Petrol',
        isEV: Boolean(vehicle.isEV || vehicle.fuelType === 'Electric'),
        evRangeKm: vehicle.evRangeKm || 0,
        nearbyChargingStations: vehicle.nearbyChargingStations || '',
        features: parsedFeatures,
        rentalRules: parsedRules
      });
      setErrorMsg('');
      setSuccessMsg('');
      setIsSubmitting(false);
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleToggleFeature = (feat) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists ? prev.features.filter((f) => f !== feat) : [...prev.features, feat]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      setErrorMsg('Vehicle listing name is required.');
      return;
    }

    if (Number(formData.dailyRate) <= 0) {
      setErrorMsg('Daily rental rate must be greater than ₹0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const rulesArray = formData.rentalRules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        variant: formData.variant.trim(),
        year: Number(formData.year) || 2024,
        registrationNumber: formData.registrationNumber.trim().toUpperCase(),
        dailyRate: Number(formData.dailyRate),
        hourlyRate: Number(formData.hourlyRate) || Math.round(Number(formData.dailyRate) / 7),
        depositAmount: Number(formData.depositAmount) || 0,
        locationArea: formData.locationArea,
        pickupAddress: formData.pickupAddress.trim(),
        availability: {
          from: formData.availabilityFrom || '2026-09-12',
          to: formData.availabilityTo || '2026-12-31',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        helmetIncluded: formData.helmetIncluded,
        helmetsProvided: Number(formData.helmetsProvided) || 2,
        odometer: Number(formData.odometer) || 10000,
        fuelType: formData.fuelType,
        isEV: formData.isEV ? 1 : 0,
        evRangeKm: Number(formData.evRangeKm) || 0,
        nearbyChargingStations: formData.nearbyChargingStations.trim(),
        features: formData.features,
        rentalRules: rulesArray
      };

      await onSave(payload);
      setSuccessMsg('Vehicle details updated successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('[EditVehicleModal] Failed to update vehicle:', err);
      setErrorMsg(err.message || 'Failed to update vehicle details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 text-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Edit Vehicle Details
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ID: {vehicle.id} • Reg: {vehicle.registrationNumber || 'N/A'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Bike className="w-4 h-4 text-emerald-600" />
              1. Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Listing Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Honda Activa 6G"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. UP85 AB 1234"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-mono font-semibold transition-colors"
                />
                <p className="text-[10px] text-slate-400 mt-1">Changing plate number requires quick admin re-verification.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Make / Brand</label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g. Honda, TVS, Royal Enfield"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model & Year</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Activa 6G"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                  />
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Security Deposit */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              2. Rental Pricing & Security Deposit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Daily Rate (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.dailyRate}
                    onChange={(e) => {
                      const daily = Number(e.target.value);
                      setFormData({
                        ...formData,
                        dailyRate: e.target.value,
                        hourlyRate: Math.round(daily / 7)
                      });
                    }}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-extrabold text-slate-900 transition-colors"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Host keeps 85% (₹{Math.round((Number(formData.dailyRate) || 0) * 0.85)})</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-colors"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">For short temple trips</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-colors"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">100% refundable upon inspection</span>
              </div>
            </div>
          </div>

          {/* Section 3: Location & Pickup */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600" />
              3. Pickup Location & Area
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Vrindavan Area <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.locationArea}
                  onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                >
                  {LOCATION_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specific Pickup Address / Landmark
                </label>
                <input
                  type="text"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  placeholder="e.g. Near Hotel Radhe Krishna Gate 2, Raman Reti"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Availability */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-emerald-600" />
              4. Availability Dates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Available From</label>
                <input
                  type="date"
                  value={formData.availabilityFrom}
                  onChange={(e) => setFormData({ ...formData, availabilityFrom: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available To</label>
                <input
                  type="date"
                  value={formData.availabilityTo}
                  onChange={(e) => setFormData({ ...formData, availabilityTo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-semibold transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Helmets & Equipment */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Shield className="w-4 h-4 text-emerald-600" />
              5. Helmets & Safety Equipment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.helmetIncluded}
                  onChange={(e) => setFormData({ ...formData, helmetIncluded: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span>Free Clean Helmets Included</span>
              </label>

              {formData.helmetIncluded && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Quantity:</span>
                  <select
                    value={formData.helmetsProvided}
                    onChange={(e) => setFormData({ ...formData, helmetsProvided: Number(e.target.value) })}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white font-bold outline-none"
                  >
                    <option value={1}>1 Helmet (Rider)</option>
                    <option value={2}>2 Helmets (Rider + Pillion)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Features & Inclusions */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              6. Features & Highlights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_FEATURES.map((feat) => {
                const checked = formData.features.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => handleToggleFeature(feat)}
                    className={`p-2 rounded-xl text-left font-semibold border transition-all text-[11px] flex items-center justify-between gap-1 cursor-pointer ${
                      checked
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="line-clamp-1">{feat}</span>
                    {checked && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 7: Rental Rules */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              7. Custom Rental Rules & Notes
            </h4>
            <textarea
              rows={3}
              value={formData.rentalRules}
              onChange={(e) => setFormData({ ...formData, rentalRules: e.target.value })}
              placeholder="Enter rental rules (one rule per line)...&#10;e.g. 1. Valid Driving Licence required&#10;2. Max Speed 40 km/h in temple galis&#10;3. No honking near silence zones"
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none leading-relaxed"
            ></textarea>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Update Bike</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;
