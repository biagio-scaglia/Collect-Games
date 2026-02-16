import { create } from 'zustand';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: number;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (type: Notification['type'], message: string) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (type, message) => {
        const id = `${Date.now()}-${Math.random()}`;
        set((state) => ({
            notifications: [...state.notifications, { id, type, message, timestamp: Date.now() }],
        }));
        // Auto-remove after 5 seconds
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 5000);
    },
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    clearAll: () => set({ notifications: [] }),
}));
