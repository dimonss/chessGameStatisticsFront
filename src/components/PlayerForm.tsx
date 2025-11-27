import { useEffect, useState, type FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlayerFormValues } from '../types/chess';
import { playerAPI } from '../utils/api';

interface PlayerFormProps {
  initialValues?: PlayerFormValues;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: PlayerFormValues) => Promise<void> | void;
  onCancel?: () => void;
  authHeader?: string | null;
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
  onCancel,
  authHeader
}: PlayerFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<PlayerFormValues>(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof PlayerFormValues, string>>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValues(initialValues ?? emptyValues);
    setAvatarFile(null);
    setAvatarPreview(initialValues?.avatar || null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Создаем превью
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    let avatarPath = values.avatar?.trim() || undefined;

    // Если выбран новый файл, загружаем его
    if (avatarFile && authHeader) {
      try {
        setUploadingAvatar(true);
        const result = await playerAPI.uploadAvatar(avatarFile, authHeader);
        avatarPath = result.avatar;
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          avatar: error instanceof Error ? error.message : t('common.error')
        }));
        setUploadingAvatar(false);
        return;
      } finally {
        setUploadingAvatar(false);
      }
    }

    await onSubmit({
      ...values,
      name: values.name.trim(),
      username: values.username.trim(),
      avatar: avatarPath
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
        <div className="space-y-3">
          {avatarPreview && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading || uploadingAvatar}
          />
          {errors.avatar && <p className="text-sm text-rose-500 mt-1">{errors.avatar}</p>}
          {uploadingAvatar && (
            <p className="text-sm text-gray-500">{t('common.uploading')}...</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploadingAvatar}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading || uploadingAvatar ? t('common.saving') : (submitLabel || t('common.save'))}
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



