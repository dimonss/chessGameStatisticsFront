import { useEffect, useState, type FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Image as ImageIcon } from 'lucide-react';
import type { PlayerFormValues } from '../types/chess';
import { playerAPI } from '../utils/api';
import { getImageUrl } from '../utils/image';

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValues(initialValues ?? emptyValues);
    setAvatarFile(null);
    // Если есть существующий аватар, используем нормализованный URL
    setAvatarPreview(initialValues?.avatar ? getImageUrl(initialValues.avatar) || null : null);
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

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        avatar: 'Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'
      }));
      return false;
    }
    
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        avatar: 'File too large. Maximum size is 5MB.'
      }));
      return false;
    }
    
    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) {
      return;
    }
    
    setAvatarFile(file);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.avatar;
      return newErrors;
    });
    
    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading && !uploadingAvatar) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (loading || uploadingAvatar) {
      return;
    }
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
      // Сбрасываем input, чтобы можно было выбрать тот же файл снова
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        // Обновляем превью на нормализованный URL после загрузки
        if (avatarPath) {
          setAvatarPreview(getImageUrl(avatarPath) || null);
        }
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
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }
              ${loading || uploadingAvatar ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => !loading && !uploadingAvatar && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading || uploadingAvatar}
            />
            
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              {isDragging ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-700">{t('player.dragDropRelease')}</p>
                    <p className="text-xs text-blue-600 mt-1">{t('player.dragDropFormats')}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    loading || uploadingAvatar 
                      ? 'bg-gray-300' 
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    {avatarPreview ? (
                      <ImageIcon className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Upload className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {avatarPreview ? t('player.dragDropReplace') : t('player.dragDropClick')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('player.dragDropFormats')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {errors.avatar && (
            <p className="text-sm text-rose-500 mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.avatar}
            </p>
          )}
          {uploadingAvatar && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="animate-spin">⏳</span> {t('common.uploading')}...
            </p>
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



