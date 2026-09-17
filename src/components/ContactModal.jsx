import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle2, AlertCircle, Loader2, User, HelpCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiSendContactMessage } from '../api/client';

// Email format regex for client-side check
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const ContactModal = ({ isOpen, onClose, initialData = {} }) => {
  const { currentUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    to: '',
    subject: '',
    message: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Pre-fill user data if logged in or initialData is passed
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name || currentUser?.name || '',
        email: initialData.email || currentUser?.email || '',
        to: initialData.to || '',
        subject: initialData.subject || '',
        message: initialData.message || ''
      });
      setFieldErrors({});
      setErrorMessage('');
      setIsSuccess(false);
      setSuccessMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen, currentUser, initialData]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    if (formData.to.trim() && !EMAIL_REGEX.test(formData.to.trim())) {
      errors.to = 'Please enter a valid recipient email format.';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Please enter a subject.';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters long.';
    } else if (formData.subject.trim().length > 200) {
      errors.subject = 'Subject cannot exceed 200 characters.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    } else if (formData.message.trim().length > 5000) {
      errors.message = 'Message cannot exceed 5000 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error on edit
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions while request is in progress
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Send request strictly server-side through /api/contact
      const response = await apiSendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        to: formData.to.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      // Show success message only when the API returns HTTP 200
      if (response && response.success) {
        setIsSuccess(true);
        setSuccessMessage(
          response.message || 'Your inquiry has been submitted successfully! We will get back to you shortly.'
        );
      } else {
        // Fallback for unexpected response structure
        setErrorMessage(response?.error || 'Unable to confirm message delivery. Please try again.');
      }
    } catch (err) {
      console.error('[ContactModal] Submission failed:', err);
      // Explicitly handle HTTP 400, 401, and 502 errors per requirements
      let formattedError = err.message || 'Failed to send message. Please try again later.';
      if (err.status === 400) {
        formattedError = `Bad Request (400): ${err.message || 'Please check your inputs and try again.'}`;
      } else if (err.status === 401) {
        formattedError = `Unauthorized (401): ${err.message || 'Email service authentication failed. Invalid token.'}`;
      } else if (err.status === 502) {
        formattedError = `Gateway Error (502): ${err.message || 'Upstream email service is currently unavailable. Please try again in a few moments.'}`;
      }
      setErrorMessage(formattedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col relative max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 id="contact-modal-title" className="font-extrabold text-base sm:text-lg text-white font-heading">
                Contact & Support
              </h3>
              <p className="text-slate-400 text-xs">
                Send a direct inquiry to the Vrindavan Rides team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong className="block text-rose-200 font-bold mb-0.5">Submission Error</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {isSuccess ? (
            <div className="py-6 px-4 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-white">Message Delivered!</h4>
                <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                  {successMessage}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 text-left max-w-sm mx-auto space-y-1">
                <p>
                  <strong className="text-slate-300">To (Recipient):</strong> {formData.to || 'dixitshivam249@gmail.com'}
                </p>
                <p>
                  <strong className="text-slate-300">From (Reply-To):</strong> {formData.name} ({formData.email})
                </p>
                <p>
                  <strong className="text-slate-300">Subject:</strong> {formData.subject}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium pt-1">
                  ✓ Confirmed via server email dispatch
                </p>
              </div>

              <div className="pt-2 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      name: currentUser?.name || '',
                      email: currentUser?.email || '',
                      to: '',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Send Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Radhe Krishna"
                    className={`w-full bg-slate-950 text-white pl-10 pr-3 py-2.5 rounded-xl border ${
                      fieldErrors.name ? 'border-rose-500' : 'border-slate-800'
                    } focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className={`w-full bg-slate-950 text-white pl-10 pr-3 py-2.5 rounded-xl border ${
                      fieldErrors.email ? 'border-rose-500' : 'border-slate-800'
                    } focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Recipient Email Field (X-Email-To) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-300">
                    Recipient Email <span className="text-slate-500 font-normal">(X-Email-To)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Default: dixitshivam249@gmail.com
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={formData.to}
                    onChange={(e) => handleChange('to', e.target.value)}
                    placeholder="e.g. dixitshivam249@gmail.com (or custom recipient)"
                    className={`w-full bg-slate-950 text-white pl-10 pr-3 py-2.5 rounded-xl border ${
                      fieldErrors.to ? 'border-rose-500' : 'border-slate-800'
                    } focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50`}
                  />
                </div>
                {fieldErrors.to && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.to}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <HelpCircle className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder="e.g. Question about scooter pickup near ISKCON temple"
                    className={`w-full bg-slate-950 text-white pl-10 pr-3 py-2.5 rounded-xl border ${
                      fieldErrors.subject ? 'border-rose-500' : 'border-slate-800'
                    } focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50`}
                  />
                </div>
                {fieldErrors.subject && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.subject}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  Message <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Write your inquiry or feedback here (min. 10 characters)..."
                    className={`w-full bg-slate-950 text-white p-3 rounded-xl border ${
                      fieldErrors.message ? 'border-rose-500' : 'border-slate-800'
                    } focus:outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-50 leading-relaxed`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  {fieldErrors.message ? (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.message}
                    </span>
                  ) : (
                    <span>Minimum 10 characters</span>
                  )}
                  <span>{formData.message.length}/5000</span>
                </div>
              </div>

              {/* Security & Action Note */}
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Your inquiry is processed safely server-side and replied to via email.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
