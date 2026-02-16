import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { wishlistApi } from '../services/api';
import type { WishlistFormData } from '../types';
import styles from './AddGameModal.module.css';

interface AddWishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddWishlistModal({ isOpen, onClose, onSuccess }: AddWishlistModalProps) {
    const [formData, setFormData] = useState<WishlistFormData>({
        title: '',
        platform: '',
        priority: 'Medium',
        estimatedPrice: undefined,
        purchaseLink: '',
        imageUrl: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await wishlistApi.addToWishlist(formData);
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: '',
                platform: '',
                priority: 'Medium',
                estimatedPrice: undefined,
                purchaseLink: '',
                imageUrl: '',
                notes: ''
            });
        } catch (err) {
            console.error('Failed to add wishlist item:', err);
            setError('Failed to add item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Add to Wishlist</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">
                            Game Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            className={styles.input}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Chrono Trigger"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="platform">
                                Platform <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="platform"
                                required
                                className={styles.input}
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                placeholder="e.g. SNES"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="priority">
                                Priority <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="priority"
                                className={styles.select}
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                            >
                                <option value="High">High (Red)</option>
                                <option value="Medium">Medium (Yellow)</option>
                                <option value="Low">Low (Blue)</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="estimatedPrice">
                                Est. Price (€)
                            </label>
                            <input
                                type="number"
                                id="estimatedPrice"
                                step="0.01"
                                min="0"
                                className={styles.input}
                                value={formData.estimatedPrice || ''}
                                onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                                placeholder="0.00"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            {/* Image input moved to bottom */}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="purchaseLink">
                            Purchase Link
                        </label>
                        <input
                            type="url"
                            id="purchaseLink"
                            className={styles.input}
                            value={formData.purchaseLink || ''}
                            onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
                            placeholder="https://ebay.com/..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            className={styles.textarea}
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Condition required, seller info, etc."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Cover Image</label>
                        <div className={styles.imageUpload}>
                            <input
                                type="file"
                                id="image"
                                className={styles.fileInput}
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setFormData({ ...formData, image: file });
                                }}
                            />
                            <label htmlFor="image" className={styles.fileLabel}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '24px' }}>📷</span>
                                    <span>{formData.image ? formData.image.name : 'Choose an image...'}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Save size={20} />
                                    Add to Wishlist
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
