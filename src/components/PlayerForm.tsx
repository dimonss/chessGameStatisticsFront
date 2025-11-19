import { useEffect, useState, type FormEvent } from 'react';
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
  submitLabel = 'Save player',
  loading = false,
  onSubmit,
  onCancel
}: PlayerFormProps) {
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
      nextErrors.name = 'Name is required';
    }
    if (!values.username.trim()) {
      nextErrors.username = 'Username is required';
    }
    if (!Number.isFinite(values.rating) || values.rating <= 0) {
      nextErrors.rating = 'Rating must be positive';
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
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
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-70"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


