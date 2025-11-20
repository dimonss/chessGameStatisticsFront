import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlayerFormValues } from '../types/chess';

interface PlayerFormProps {
  initialValues?: PlayerFormValues;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: PlayerFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const emptyValues: PlayerFormValues = {
  name: '',
  username: '',
  rating: 1200,
  avatar: ''
};

export function PlayerForm({
  initialValues,
  submitLabel,
  loading = false,
  onSubmit,
  onCancel
}: PlayerFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<PlayerFormValues>(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof PlayerFormValues, string>>>({});

  useEffect(() => {
    setValues(initialValues ?? emptyValues);
  }, [initialValues]);

  const handleChange = (field: keyof PlayerFormValues, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: field === 'rating' ? Number(value) || 0 : value
    }));
  };

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!values.name.trim()) {
      nextErrors.name = t('validation.required');
    }
    if (!values.username.trim()) {
      nextErrors.username = t('validation.required');
    }
    if (!Number.isFinite(values.rating) || values.rating <= 0) {
      nextErrors.rating = t('validation.positive');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    await onSubmit({
      ...values,
      name: values.name.trim(),
      username: values.username.trim(),
      avatar: values.avatar?.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('player.name')}</label>
        <input
          type="text"
          value={values.name}
          onChange={event => handleChange('name', event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Magnus Carlsen"
          disabled={loading}
        />
        {errors.name && <p className="text-sm text-rose-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('player.username')}</label>
        <input
          type="text"
          value={values.username}
          onChange={event => handleChange('username', event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="gm-carlsen"
          disabled={loading}
        />
        {errors.username && <p className="text-sm text-rose-500 mt-1">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('player.rating')}</label>
        <input
          type="number"
          value={values.rating}
          onChange={event => handleChange('rating', event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min={1}
          step={1}
          disabled={loading}
        />
        {errors.rating && <p className="text-sm text-rose-500 mt-1">{errors.rating}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('player.avatarUrl')}</label>
        <input
          type="url"
          value={values.avatar ?? ''}
          onChange={event => handleChange('avatar', event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/avatar.jpg"
          disabled={loading}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? t('common.saving') : (submitLabel || t('common.save'))}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-70"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </form>
  );
}



