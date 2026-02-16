import { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Console } from '../types';
import styles from './Filters.module.css';

interface FiltersProps {
    consoles: Console[];
    onSearchChange: (search: string) => void;
    onPlatformChange: (platform: string) => void;
    onConditionChange: (condition: string) => void;
}

export function Filters({
    consoles,
    onSearchChange,
    onPlatformChange,
    onConditionChange
}: FiltersProps) {
    const [search, setSearch] = useState('');
    const [platform, setPlatform] = useState('');
    const [condition, setCondition] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, onSearchChange]);

    const handleReset = () => {
        setSearch('');
        setPlatform('');
        setCondition('');
        onSearchChange('');
        onPlatformChange('');
        onConditionChange('');
    };

    return (
        <motion.div
            className={styles.filters}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <div className={styles.container}>
                <div className={styles.searchWrapper}>
                    <Search size={20} className={styles.searchIcon} aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                        aria-label="Search games by title"
                    />
                </div>

                <select
                    value={platform}
                    onChange={(e) => {
                        setPlatform(e.target.value);
                        onPlatformChange(e.target.value);
                    }}
                    className={styles.select}
                    aria-label="Filter by platform"
                >
                    <option value="">All Platforms</option>
                    {consoles.map((console) => (
                        <option key={console.id} value={console.name}>
                            {console.name}
                        </option>
                    ))}
                </select>

                <select
                    value={condition}
                    onChange={(e) => {
                        setCondition(e.target.value);
                        onConditionChange(e.target.value);
                    }}
                    className={styles.select}
                    aria-label="Filter by condition"
                >
                    <option value="">All Conditions</option>
                    <option value="Loose">Loose</option>
                    <option value="CIB">CIB (Complete in Box)</option>
                    <option value="Sealed">Sealed</option>
                </select>

                <motion.button
                    onClick={handleReset}
                    className={styles.resetButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Reset all filters"
                >
                    <RotateCcw size={18} aria-hidden="true" />
                    <span>Reset</span>
                </motion.button>
            </div>
        </motion.div>
    );
}
