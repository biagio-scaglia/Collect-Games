import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionApi } from '../services/api';
import type { UserCollectionItem } from '../types';
import styles from './AddGameModal.module.css';

const editGameSchema = z.object({
    condition: z.enum(['Loose', 'CIB', 'Sealed']),
    pricePaid: z.number().min(0).optional().or(z.literal(undefined)),
    purchaseDate: z.string().optional(),
    notes: z.string().optional(),
});

type EditGameFormData = z.infer<typeof editGameSchema>;

interface EditGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: UserCollectionItem | null;
}

export function EditGameModal({ isOpen, onClose, onSuccess, item }: EditGameModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<EditGameFormData>({
        resolver: zodResolver(editGameSchema),
    });

    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (item) {
            reset({
                condition: item.condition as any,
                pricePaid: item.pricePaid,
                purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
                notes: item.notes || '',
            });
            if (item.userImagePath) {
                setImagePreview(`http://localhost:5000${item.userImagePath}`);
            } else {
                setImagePreview(null);
            }
        }
    }, [item, reset]);

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

    const onSubmit = async (data: EditGameFormData) => {
        if (!item) return;
        setSubmitError(null);
        try {
            await collectionApi.updateGame(item.id, {
                ...data,
                image: imageFile || undefined,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to update game');
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                className={styles.overlay}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                className={styles.modal}
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            >
                                <div className={styles.header}>
                                    <Dialog.Title className={styles.title}>Edit Game</Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className={styles.closeButton} aria-label="Close modal">
                                            <X size={24} />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                                    {submitError && (
                                        <div className={styles.error} role="alert">
                                            {submitError}
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Title</label>
                                        <input
                                            className={styles.input}
                                            value={item?.game?.title || ''}
                                            disabled
                                        />
                                        <small className={styles.helpText}>Title cannot be changed</small>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="edit-condition" className={styles.label}>Condition *</label>
                                            <select
                                                {...register('condition')}
                                                id="edit-condition"
                                                className={styles.select}
                                            >
                                                <option value="Loose">Loose</option>
                                                <option value="CIB">CIB</option>
                                                <option value="Sealed">Sealed</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label htmlFor="edit-pricePaid" className={styles.label}>Price Paid (€)</label>
                                            <input
                                                {...register('pricePaid', { valueAsNumber: true })}
                                                id="edit-pricePaid"
                                                type="number"
                                                step="0.01"
                                                className={styles.input}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="edit-purchaseDate" className={styles.label}>Purchase Date</label>
                                        <input
                                            {...register('purchaseDate')}
                                            id="edit-purchaseDate"
                                            type="date"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="edit-notes" className={styles.label}>Notes</label>
                                        <textarea
                                            {...register('notes')}
                                            id="edit-notes"
                                            className={styles.textarea}
                                            placeholder="Add any notes..."
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={styles.fileInput}
                                            id="edit-image-upload"
                                        />
                                        <label htmlFor="edit-image-upload" className={styles.fileLabel}>
                                            <Upload size={20} />
                                            <span>{imageFile ? imageFile.name : 'Change Image'}</span>
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
                                            <Check size={20} />
                                            <span>{isSubmitting ? 'Updating...' : 'Update Game'}</span>
                                        </motion.button>

                                        <Dialog.Close asChild>
                                            <motion.button
                                                type="button"
                                                className={styles.cancelButton}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <X size={20} />
                                                <span>Cancel</span>
                                            </motion.button>
                                        </Dialog.Close>
                                    </div>
                                </form>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
