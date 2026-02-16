import { Gamepad2, Plus, Package, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

interface HeaderProps {
    totalGames: number;
    onAddClick: () => void;
    onExportPdf: () => void;
}

export function Header({ totalGames, onAddClick, onExportPdf }: HeaderProps) {
    return (
        <motion.header
            className={styles.header}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={styles.container}>
                <div className={styles.logo}>
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    >
                        <Gamepad2 size={48} className={styles.logoIcon} aria-hidden="true" />
                    </motion.div>
                    <div className={styles.logoText}>
                        <h1 className={styles.title}>CollectGames</h1>
                        <p className={styles.subtitle}>Retro Collection Manager</p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <div className={styles.stats} role="status" aria-live="polite">
                        <Package size={20} className={styles.statsIcon} aria-hidden="true" />
                        <span className={styles.statsText} aria-label={`Total games: ${totalGames}`}>
                            {totalGames}
                        </span>
                    </div>

                    <motion.button
                        className={styles.exportButton}
                        onClick={onExportPdf}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Export Collection to PDF"
                    >
                        <FileDown size={20} aria-hidden="true" />
                        <span>PDF</span>
                    </motion.button>

                    <motion.button
                        className={styles.addButton}
                        onClick={onAddClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Add new game to collection"
                    >
                        <Plus size={20} aria-hidden="true" />
                        <span>Add Game</span>
                    </motion.button>
                </div>
            </div>
        </motion.header>
    );
}
