'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    matterType: '',
    message: '',
    languagePreference: 'vi',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.matterType) {
      setError('Please select a matter type.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          matterType: formData.matterType,
          message: formData.message.trim(),
          language: formData.languagePreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        matterType: '',
        message: '',
        languagePreference: 'vi',
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface border border-accent/30 p-12 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-heading font-semibold text-primary mb-2">
          {formData.languagePreference === 'vi'
            ? 'Cam on ban da lien he!'
            : 'Thank you for reaching out!'}
        </h3>
        <p className="text-text-secondary">{t('responseCommitment')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          {t('name')} <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
          placeholder={t('name')}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          {t('email')} <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
          placeholder={t('email')}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
          {t('phone')}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
          placeholder={t('phone')}
        />
      </div>

      {/* Matter Type */}
      <div>
        <label htmlFor="matterType" className="block text-sm font-medium text-text-primary mb-2">
          {t('matterType')} <span className="text-accent">*</span>
        </label>
        <select
          id="matterType"
          name="matterType"
          required
          value={formData.matterType}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors appearance-none disabled:opacity-50"
        >
          <option value="">{t('matterType')}</option>
          <option value="civil">{t('matterTypes.civil')}</option>
          <option value="land">{t('matterTypes.land')}</option>
          <option value="family">{t('matterTypes.family')}</option>
          <option value="corporate">{t('matterTypes.corporate')}</option>
          <option value="criminal">{t('matterTypes.criminal')}</option>
          <option value="labor">{t('matterTypes.labor')}</option>
          <option value="other">{t('matterTypes.other')}</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
          {t('message')} <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors resize-none disabled:opacity-50"
          placeholder={t('message')}
        />
      </div>

      {/* Language Preference */}
      <div>
        <label htmlFor="languagePreference" className="block text-sm font-medium text-text-primary mb-2">
          {t('languagePreference')}
        </label>
        <select
          id="languagePreference"
          name="languagePreference"
          value={formData.languagePreference}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors appearance-none disabled:opacity-50"
        >
          <option value="vi">Tieng Viet</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Submit */}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t('submitting') || 'Submitting...'}
          </span>
        ) : (
          t('submit')
        )}
      </Button>

      <p className="text-text-secondary text-sm text-center">
        {t('responseCommitment')}
      </p>
    </form>
  );
}
