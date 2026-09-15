import React from 'react';
import { Camera, Gauge, Fuel, AlertTriangle, CheckCircle2, X, ArrowRight, ShieldCheck, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InspectionDiffViewer = ({ bookingId, onClose }) => {
  const { bookings, inspections } = useApp();
  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];
  const record = inspections[bookingId];

  const pre = record?.preRental;
  const post = record?.postRental;

  const odometerDiff = post?.odometer && pre?.odometer ? post.odometer - pre.odometer : null;
  const fuelDiff = post?.fuelLevel !== undefined && pre?.fuelLevel !== undefined ? post.fuelLevel - pre.fuelLevel : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 custom-scrollbar">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sticky top-0 z-10 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Inspection Audit (Before vs After)</h3>
              <p className="text-xs text-slate-400">
                Booking Ref: #{booking?.id} • {booking?.vehicleName} • Customer: {booking?.customerName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Audit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Odometer Delta</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-900">
                  <Gauge className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pre?.odometer || '—'}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{post?.odometer || '—'}</span>
                </div>
                {odometerDiff !== null && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded">
                    +{odometerDiff} km
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Fuel / Battery Level</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-900">
                  <Fuel className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pre?.fuelLevel !== undefined ? `${pre.fuelLevel}%` : '—'}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{post?.fuelLevel !== undefined ? `${post.fuelLevel}%` : '—'}</span>
                </div>
                {fuelDiff !== null && (
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      fuelDiff < 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {fuelDiff}%
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block mb-1">360° Video Walkaround</span>
              <div className="flex items-center gap-1 text-xs font-bold">
                <Video className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">
                  Pre: {pre?.walkaroundVideoRecorded ? '✓ Logged' : '—'} | Post: {post?.walkaroundVideoRecorded ? '✓ Logged' : '—'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Audit Status</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{booking?.status}</span>
                {booking?.status === 'Dispute' ? (
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded animate-pulse">
                    Dispute Flagged
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                    Verified Match
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 7-Angle Photo Comparison Grid */}
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              7-Angle Photo Audit Comparison (Before vs After)
            </h4>

            <div className="space-y-4">
              {[
                { title: '1. Front Photo', preKey: pre?.frontPhoto, postKey: post?.frontPhoto },
                { title: '2. Rear Photo', preKey: pre?.rearPhoto, postKey: post?.rearPhoto },
                { title: '3. Left Side', preKey: pre?.leftPhoto, postKey: post?.leftPhoto },
                { title: '4. Right Side', preKey: pre?.rightPhoto, postKey: post?.rightPhoto },
                { title: '5. Dashboard / Meter', preKey: pre?.dashboardPhoto, postKey: post?.dashboardPhoto },
                { title: '6. Front Tyre', preKey: pre?.frontTyrePhoto || pre?.tyresPhoto, postKey: post?.frontTyrePhoto || post?.tyresPhoto },
                { title: '7. Rear Tyre', preKey: pre?.rearTyrePhoto || pre?.tyresPhoto, postKey: post?.rearTyrePhoto || post?.tyresPhoto }
              ].map((angle, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <span className="text-xs font-bold text-slate-800 block mb-2">{angle.title}</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">PRE-RENTAL (BEFORE)</span>
                        <span className="text-[10px] text-slate-400">{pre?.inspectedAt || 'Pending pickup'}</span>
                      </div>
                      {angle.preKey ? (
                        <img src={angle.preKey} alt="Pre Inspection" className="w-full h-32 object-cover rounded-md border border-slate-200" />
                      ) : (
                        <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400 font-semibold">
                          Pending Pre-Inspection
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-blue-700">POST-RENTAL (AFTER)</span>
                        <span className="text-[10px] text-slate-400">{post?.inspectedAt || 'Pending return'}</span>
                      </div>
                      {angle.postKey ? (
                        <img src={angle.postKey} alt="Post Inspection" className="w-full h-32 object-cover rounded-md border border-slate-200" />
                      ) : (
                        <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400 font-semibold">
                          Pending Post-Inspection
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Damage Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Pre-Rental Damage Notes
              </h5>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 min-h-[60px]">
                {pre?.existingDamage || 'No pre-rental inspection record logged yet.'}
              </p>
              <div className="text-[11px] text-slate-500">
                Customer Signature: {pre?.customerConfirmed ? '✓ Confirmed' : 'Pending'} • Owner: {pre?.ownerConfirmed ? '✓ Confirmed' : 'Pending'}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Post-Rental Damage Notes
              </h5>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 min-h-[60px]">
                {post?.existingDamage || 'No post-rental inspection record logged yet.'}
              </p>
              <div className="text-[11px] text-slate-500">
                Customer Signature: {post?.customerConfirmed ? '✓ Confirmed' : 'Pending'} • Owner: {post?.ownerConfirmed ? '✓ Confirmed' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

