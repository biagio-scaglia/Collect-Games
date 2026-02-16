import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionApi } from '../services/api';
import type { Console } from '../types';
import styles from './AddGameModal.module.css';

// Zod Schema for validation
const addGameSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    platform: z.string().min(1, 'Platform is required'),
    condition: z.enum(['Loose', 'CIB', 'Sealed']),
    pricePaid: z.number().min(0).optional().or(z.literal(undefined)),
    purchaseDate: z.string().optional(),
    notes: z.string().optional(),
});

type AddGameFormData = z.infer<typeof addGameSchema>;

interface AddGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    consoles: Console[];
}

export function AddGameModal({ isOpen, onClose, onSuccess, consoles }: AddGameModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddGameFormData>({
        resolver: zodResolver(addGameSchema),
        defaultValues: {
            condition: 'Loose',
        },
    });

    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

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

    const onSubmit = async (data: AddGameFormData) => {
        setSubmitError(null);
        try {
            await collectionApi.addGame({
                ...data,
                image: imageFile || undefined,
            });
            reset();
            setImageFile(null);
            setImagePreview(null);
            onSuccess();
            onClose();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to add game');
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
                                    <Dialog.Title className={styles.title}>Add Game</Dialog.Title>
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
                                        <label htmlFor="title" className={styles.label}>
                                            Title <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            {...register('title')}
                                            id="title"
                                            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                                            placeholder="Enter game title"
                                        />
                                        {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="platform" className={styles.label}>
                                            Platform <span className={styles.required}>*</span>
                                        </label>
                                        <select
                                            {...register('platform')}
                                            id="platform"
                                            className={`${styles.select} ${errors.platform ? styles.inputError : ''}`}
                                        >
                                            <option value="">Select platform</option>
                                            {consoles.map((console) => (
                                                <option key={console.id} value={console.name}>
                                                    {console.name} ({console.manufacturer})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.platform && <span className={styles.errorText}>{errors.platform.message}</span>}
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="condition" className={styles.label}>
                                                Condition <span className={styles.required}>*</span>
                                            </label>
                                            <select
                                                {...register('condition')}
                                                id="condition"
                                                className={styles.select}
                                            >
                                                <option value="Loose">Loose</option>
                                                <option value="CIB">CIB</option>
                                                <option value="Sealed">Sealed</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label htmlFor="pricePaid" className={styles.label}>
                                                Price Paid (€)
                                            </label>
                                            <input
                                                {...register('pricePaid', { valueAsNumber: true })}
                                                id="pricePaid"
                                                type="number"
                                                step="0.01"
                                                className={styles.input}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="purchaseDate" className={styles.label}>
                                            Purchase Date
                                        </label>
                                        <input
                                            {...register('purchaseDate')}
                                            id="purchaseDate"
                                            type="date"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="notes" className={styles.label}>
                                            Notes
                                        </label>
                                        <textarea
                                            {...register('notes')}
                                            id="notes"
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
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className={styles.fileLabel}>
                                            <Upload size={20} />
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
                                            <Check size={20} />
                                            <span>{isSubmitting ? 'Adding...' : 'Add Game'}</span>
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
