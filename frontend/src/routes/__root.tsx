import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Gamepad2, Heart, MessageSquare } from 'lucide-react';
import { Header } from '../components/Header';
import * as Tabs from '@radix-ui/react-tabs';
import styles from '../App.module.css';
import { useCollection } from '../hooks/useCollection';
import { useConsoles } from '../hooks/useConsoles';
import { useState, lazy, Suspense } from 'react';

// Lazy load modals
const AddGameModal = lazy(() => import('../components/AddGameModal').then(m => ({ default: m.AddGameModal })));

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const { data: collection } = useCollection();
    const { data: consoles } = useConsoles();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExportPdf = () => {
        window.open('http://localhost:5000/api/UserCollection/export/pdf', '_blank');
    };

    return (
        <div className={styles.app}>
            <Header
                totalGames={collection?.length ?? 0}
                onAddClick={() => setIsModalOpen(true)}
                onExportPdf={handleExportPdf}
            />

            <Tabs.Root className={styles.tabsRoot}>
                <Tabs.List className={styles.navTabs}>
                    <Tabs.Trigger asChild value="collection">
                        <Link to="/" className={styles.navTab} activeProps={{ 'data-state': 'active' }}>
                            <Gamepad2 size={18} /> Collection
                        </Link>
                    </Tabs.Trigger>
                    <Tabs.Trigger asChild value="wishlist">
                        <Link to="/wishlist" className={styles.navTab} activeProps={{ 'data-state': 'active' }}>
                            <Heart size={18} /> Wishlist
                        </Link>
                    </Tabs.Trigger>
                    <Tabs.Trigger asChild value="reviews">
                        <Link to="/reviews" className={styles.navTab} activeProps={{ 'data-state': 'active' }}>
                            <MessageSquare size={18} /> Reviews
                        </Link>
                    </Tabs.Trigger>
                </Tabs.List>

                <main className={styles.main}>
                    <Outlet />
                </main>
            </Tabs.Root>

            <Suspense fallback={null}>
                <AddGameModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { }}
                    consoles={consoles ?? []}
                />
            </Suspense>

            <footer className={styles.footer}>
                <p className={styles.footerText}>Made with ♥ by Biagio</p>
            </footer>
        </div>
    );
}
