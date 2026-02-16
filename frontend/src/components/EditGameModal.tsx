import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionApi } from '../services/api';
import type { UserCollectionItem, AddGameFormData } from '../types';
import styles from './AddGameModal.module.css';

interface EditGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: UserCollectionItem | null;
}

export function EditGameModal({ isOpen, onClose, onSuccess, item }: EditGameModalProps) {
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

    // Initialize form with item data
    useEffect(() => {
        if (item) {
            setFormData({
                title: item.game?.title || '',
                platform: item.game?.platform || '',
                condition: item.condition,
                pricePaid: item.pricePaid,
                purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
                notes: item.notes || '',
            });
            // Set existing image preview
            if (item.userImagePath) {
                setImagePreview(`http://localhost:5000${item.userImagePath}`);
            }
        }
    }, [item]);

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
        if (!item) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const submitData: AddGameFormData = {
                ...formData,
                image: imageFile || undefined,
            };

            await collectionApi.updateGame(item.id, submitData);
            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update game');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
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
        setError(null);
    };

    if (!isOpen || !item) return null;

    return (
        <AnimatePresence>
            <div className={styles.overlay} onClick={onClose}>
                <motion.div
                    ref={modalRef}
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-game-title"
                >
                    <div className={styles.header}>
                        <h2 id="edit-game-title" className={styles.title}>
                            Edit Game
                        </h2>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close modal"
                            type="button"
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
                            <label htmlFor="edit-title" className={styles.label}>
                                Title *
                            </label>
                            <input
                                id="edit-title"
                                type="text"
                                className={styles.input}
                                value={formData.title}
                                disabled
                                aria-describedby="title-help"
                            />
                            <small id="title-help" className={styles.helpText}>
                                Title cannot be changed
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="edit-platform" className={styles.label}>
                                Platform *
                            </label>
                            <input
                                id="edit-platform"
                                type="text"
                                className={styles.input}
                                value={formData.platform}
                                disabled
                                aria-describedby="platform-help"
                            />
                            <small id="platform-help" className={styles.helpText}>
                                Platform cannot be changed
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="edit-condition" className={styles.label}>
                                Condition *
                            </label>
                            <select
                                id="edit-condition"
                                className={styles.select}
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                required
                            >
                                <option value="Loose">Loose</option>
                                <option value="CIB">CIB (Complete in Box)</option>
                                <option value="Sealed">Sealed</option>
                            </select>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="edit-price" className={styles.label}>
                                    Price Paid (€)
                                </label>
                                <input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={styles.input}
                                    value={formData.pricePaid || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pricePaid: e.target.value ? parseFloat(e.target.value) : undefined,
                                        })
                                    }
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="edit-date" className={styles.label}>
                                    Purchase Date
                                </label>
                                <input
                                    id="edit-date"
                                    type="date"
                                    className={styles.input}
                                    value={formData.purchaseDate}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="edit-notes" className={styles.label}>
                                Notes
                            </label>
                            <textarea
                                id="edit-notes"
                                className={styles.textarea}
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional notes..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="edit-image" className={styles.label}>
                                Game Image
                            </label>
                            <div className={styles.imageUpload}>
                                <input
                                    ref={fileInputRef}
                                    id="edit-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.fileInput}
                                    aria-describedby="image-help"
                                />
                                <button
                                    type="button"
                                    className={styles.uploadButton}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={20} />
                                    <span>{imageFile ? 'Change Image' : 'Upload New Image'}</span>
                                </button>
                                {imagePreview && (
                                    <div className={styles.imagePreview}>
                                        <img src={imagePreview} alt="Preview" />
                                    </div>
                                )}
                                <small id="image-help" className={styles.helpText}>
                                    Leave empty to keep current image
                                </small>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Game'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
