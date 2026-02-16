import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewsApi } from '../services/api';
import type { UserCollectionItem } from '../types';
import { StarRating } from './StarRating';
import styles from './AddGameModal.module.css';

const reviewSchema = z.object({
    rating: z.number().min(1).max(10),
    reviewText: z.string().min(10, 'Review must be at least 10 characters').max(2000),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    gameItem: UserCollectionItem | null;
}

export function AddReviewModal({ isOpen, onClose, onSuccess, gameItem }: AddReviewModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 5,
            reviewText: '',
        },
    });

    const rating = watch('rating');
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            reset();
            setSubmitError(null);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: ReviewFormData) => {
        if (!gameItem) return;
        setSubmitError(null);
        try {
            await reviewsApi.createReview({
                userCollectionItemId: gameItem.id,
                ...data,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to add review');
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
                            >
                                <div className={styles.header}>
                                    <Dialog.Title className={styles.title}>Review: {gameItem?.game?.title}</Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className={styles.closeButton} aria-label="Close modal">
                                            <X size={24} />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                                    {submitError && (
                                        <div className={styles.error} role="alert">
                                            <AlertCircle size={16} />
                                            <span>{submitError}</span>
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Rating</label>
                                        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                            <StarRating
                                                rating={rating}
                                                onRatingChange={(val) => setValue('rating', val)}
                                                size={32}
                                            />
                                        </div>
                                        {errors.rating && <span className={styles.errorText}>{errors.rating.message}</span>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="reviewText">
                                            Review <span className={styles.required}>*</span>
                                        </label>
                                        <textarea
                                            {...register('reviewText')}
                                            id="reviewText"
                                            className={`${styles.textarea} ${errors.reviewText ? styles.inputError : ''}`}
                                            placeholder="What do you think about this game?"
                                            rows={5}
                                        />
                                        {errors.reviewText ? (
                                            <span className={styles.errorText}>{errors.reviewText.message}</span>
                                        ) : (
                                            <span className={styles.helpText}>Min 10 characters</span>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        <Dialog.Close asChild>
                                            <button type="button" className={styles.cancelButton}>
                                                Cancel
                                            </button>
                                        </Dialog.Close>
                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Saving...' : (
                                                <>
                                                    <Save size={20} />
                                                    <span>Save Review</span>
                                                </>
                                            )}
                                        </button>
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
