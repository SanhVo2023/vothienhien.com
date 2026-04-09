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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - form submission logic will be added later
    setSubmitted(true);
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
          {t('languagePreference') === 'Ngon ngu uu tien'
            ? 'Cam on ban da lien he!'
            : 'Thank you for reaching out!'}
        </h3>
        <p className="text-text-secondary">{t('responseCommitment')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors"
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
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors"
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
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors"
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
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors appearance-none"
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
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors resize-none"
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
          className="w-full px-4 py-3 bg-background border border-border-gold/30 text-text-primary focus:border-accent focus:outline-none transition-colors appearance-none"
        >
          <option value="vi">Tieng Viet</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Submit */}
      <Button type="submit" variant="primary" size="lg" className="w-full">
        {t('submit')}
      </Button>

      <p className="text-text-secondary text-sm text-center">
        {t('responseCommitment')}
      </p>
    </form>
  );
}
