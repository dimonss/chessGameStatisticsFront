import { useEffect, useState, type FormEvent } from 'react';
import type { ChessGame, PlayerWithStats } from '../types/chess';
import { playerAPI } from '../utils/api';

interface GameFormProps {
    initialValues?: Partial<ChessGame>;
    submitLabel?: string;
    loading?: boolean;
    onSubmit: (values: Partial<ChessGame>) => Promise<void> | void;
    onCancel?: () => void;
}

const emptyValues: Partial<ChessGame> = {
    date: new Date().toISOString().split('T')[0],
    playerId: '',
    opponentId: '',
    result: 'win',
    color: 'white',
    timeControl: 'rapid',
    moves: 40,
    rating: {
        before: 1200,
        after: 1210,
        change: 10
    },
    opening: '',
    notes: ''
};

export function GameForm({
    initialValues,
    submitLabel = 'Save game',
    loading = false,
    onSubmit,
    onCancel
}: GameFormProps) {
    const [values, setValues] = useState<Partial<ChessGame>>(initialValues ?? emptyValues);
    const [players, setPlayers] = useState<PlayerWithStats[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const data = await playerAPI.getAll();
                setPlayers(data);
            } catch (error) {
                console.error('Failed to load players', error);
            }
        };
        loadPlayers();
    }, []);

    useEffect(() => {
        if (initialValues) {
            setValues({
                ...emptyValues,
                ...initialValues,
                rating: { ...emptyValues.rating!, ...initialValues.rating }
            });
        }
    }, [initialValues]);

    const handleChange = (field: keyof ChessGame, value: any) => {
        setValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRatingChange = (field: 'before' | 'after' | 'change', value: string) => {
        const numValue = Number(value) || 0;
        setValues(prev => ({
            ...prev,
            rating: {
                ...prev.rating!,
                [field]: numValue
            }
        }));
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!values.date) nextErrors.date = 'Date is required';
        if (!values.playerId) nextErrors.playerId = 'Player is required';
        if (!values.opponentId) nextErrors.opponentId = 'Opponent is required';
        if (values.playerId === values.opponentId) nextErrors.opponentId = 'Player and opponent cannot be the same';
        if (!values.moves || values.moves <= 0) nextErrors.moves = 'Moves must be positive';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) return;
        await onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={values.date}
                        onChange={e => handleChange('date', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    {errors.date && <p className="text-sm text-rose-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Control</label>
                    <select
                        value={values.timeControl}
                        onChange={e => handleChange('timeControl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="bullet">Bullet</option>
                        <option value="blitz">Blitz</option>
                        <option value="rapid">Rapid</option>
                        <option value="classical">Classical</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Player (White/Black based on color)</label>
                    <select
                        value={values.playerId}
                        onChange={e => handleChange('playerId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="">Select Player</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (@{p.username})</option>
                        ))}
                    </select>
                    {errors.playerId && <p className="text-sm text-rose-500 mt-1">{errors.playerId}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opponent</label>
                    <select
                        value={values.opponentId}
                        onChange={e => handleChange('opponentId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="">Select Opponent</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (@{p.username})</option>
                        ))}
                    </select>
                    {errors.opponentId && <p className="text-sm text-rose-500 mt-1">{errors.opponentId}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                    <select
                        value={values.result}
                        onChange={e => handleChange('result', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                        <option value="draw">Draw</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color (for Player)</label>
                    <select
                        value={values.color}
                        onChange={e => handleChange('color', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Moves</label>
                    <input
                        type="number"
                        value={values.moves}
                        onChange={e => handleChange('moves', Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        min={1}
                        disabled={loading}
                    />
                    {errors.moves && <p className="text-sm text-rose-500 mt-1">{errors.moves}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening</label>
                    <input
                        type="text"
                        value={values.opening || ''}
                        onChange={e => handleChange('opening', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Sicilian Defense"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating Changes (for Player)</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Before</label>
                        <input
                            type="number"
                            value={values.rating?.before}
                            onChange={e => handleRatingChange('before', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">After</label>
                        <input
                            type="number"
                            value={values.rating?.after}
                            onChange={e => handleRatingChange('after', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Change</label>
                        <input
                            type="number"
                            value={values.rating?.change}
                            onChange={e => handleRatingChange('change', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                    value={values.notes || ''}
                    onChange={e => handleChange('notes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Game analysis or comments..."
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
