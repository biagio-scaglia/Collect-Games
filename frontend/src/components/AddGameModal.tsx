import { useState, useRef, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionApi } from '../services/api';
import type { Console, AddGameFormData } from '../types';
import styles from './AddGameModal.module.css';

interface AddGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    consoles: Console[];
}

export function AddGameModal({ isOpen, onClose, onSuccess, consoles }: AddGameModalProps) {
    const [formData, setFormData] = useState<AddGameFormData>({
        title: '',
        platform: '',
        condition: 'Loose',
        pricePaid: undefined,
        purchaseDate: '',
        notes: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, input, select, textarea'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            firstElement?.focus();
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const submitData: AddGameFormData = {
                ...formData,
                image: imageFile || undefined,
            };

            await collectionApi.addGame(submitData);

            // Reset form
            setFormData({
                title: '',
                platform: '',
                condition: 'Loose',
                pricePaid: undefined,
                purchaseDate: '',
                notes: '',
            });
            setImageFile(null);
            setImagePreview(null);

            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add game');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <motion.div
                        ref={modalRef}
                        className={styles.modal}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.header}>
                            <h2 id="modal-title" className={styles.title}>Add Game</h2>
                            <button
                                onClick={onClose}
                                className={styles.closeButton}
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && (
                                <div className={styles.error} role="alert">
                                    {error}
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="title" className={styles.label}>
                                    Title <span className={styles.required}>*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={styles.input}
                                    placeholder="Enter game title"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="platform" className={styles.label}>
                                    Platform <span className={styles.required}>*</span>
                                </label>
                                <select
                                    id="platform"
                                    required
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="">Select platform</option>
                                    {consoles.map((console) => (
                                        <option key={console.id} value={console.name}>
                                            {console.name} ({console.manufacturer})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="condition" className={styles.label}>
                                    Condition <span className={styles.required}>*</span>
                                </label>
                                <select
                                    id="condition"
                                    required
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    className={styles.select}
                                >
                                    <option value="Loose">Loose (Game Only)</option>
                                    <option value="CIB">CIB (Complete in Box)</option>
                                    <option value="Sealed">Sealed</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="pricePaid" className={styles.label}>
                                    Price Paid (€)
                                </label>
                                <input
                                    id="pricePaid"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.pricePaid || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricePaid: e.target.value ? parseFloat(e.target.value) : undefined
                                    })}
                                    className={styles.input}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="purchaseDate" className={styles.label}>
                                    Purchase Date
                                </label>
                                <input
                                    id="purchaseDate"
                                    type="date"
                                    value={formData.purchaseDate}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="notes" className={styles.label}>
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className={styles.textarea}
                                    placeholder="Add any notes about this game..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Image
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.fileInput}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className={styles.fileLabel}>
                                    <Upload size={20} aria-hidden="true" />
                                    <span>{imageFile ? imageFile.name : 'Choose image'}</span>
                                </label>
                                {imagePreview && (
                                    <div className={styles.preview}>
                                        <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={styles.submitButton}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Check size={20} aria-hidden="true" />
                                    <span>{isSubmitting ? 'Adding...' : 'Add Game'}</span>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className={styles.cancelButton}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <X size={20} aria-hidden="true" />
                                    <span>Cancel</span>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
