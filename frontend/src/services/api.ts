import axios from 'axios';
import type {
    UserCollectionItem,
    AddGameFormData,
    Console,
    WishlistItem,
    WishlistFormData,
    Review,
    ReviewFormData
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const collectionApi = {
    async fetchCollection(): Promise<UserCollectionItem[]> {
        const response = await api.get<UserCollectionItem[]>('/UserCollection');
        return response.data;
    },

    async addGame(formData: AddGameFormData): Promise<UserCollectionItem> {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('platform', formData.platform);
        data.append('condition', formData.condition);
        if (formData.pricePaid) data.append('pricePaid', formData.pricePaid.toString());
        if (formData.purchaseDate) data.append('purchaseDate', formData.purchaseDate);
        if (formData.notes) data.append('notes', formData.notes);
        if (formData.image) data.append('image', formData.image);

        const response = await api.post<UserCollectionItem>('/UserCollection', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async updateGame(id: number, formData: AddGameFormData): Promise<UserCollectionItem> {
        const data = new FormData();

        if (formData.condition) data.append('condition', formData.condition);
        if (formData.pricePaid) data.append('pricePaid', formData.pricePaid.toString());
        if (formData.purchaseDate) data.append('purchaseDate', formData.purchaseDate);
        if (formData.notes) data.append('notes', formData.notes);
        if (formData.image) data.append('image', formData.image);

        const response = await api.put<UserCollectionItem>(`/UserCollection/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async deleteGame(id: number): Promise<void> {
        await api.delete(`/UserCollection/${id}`);
    },
};

export const consolesApi = {
    async fetchConsoles(): Promise<Console[]> {
        const response = await api.get<Console[]>('/Consoles');
        return response.data;
    },
};

export const wishlistApi = {
    async fetchWishlist(): Promise<WishlistItem[]> {
        const response = await api.get<WishlistItem[]>('/Wishlist');
        return response.data;
    },

    async addToWishlist(data: WishlistFormData): Promise<WishlistItem> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('platform', data.platform);
        formData.append('priority', data.priority);
        if (data.estimatedPrice) formData.append('estimatedPrice', data.estimatedPrice.toString());
        if (data.purchaseLink) formData.append('purchaseLink', data.purchaseLink);
        if (data.notes) formData.append('notes', data.notes);
        if (data.image) formData.append('image', data.image);
        // We handle imageUrl as specific override or fallback? For now let's just use image file if present.

        const response = await api.post<WishlistItem>('/Wishlist', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async updateWishlistItem(id: number, data: Partial<WishlistFormData>): Promise<WishlistItem> {
        const response = await api.put<WishlistItem>(`/Wishlist/${id}`, data);
        return response.data;
    },

    async deleteWishlistItem(id: number): Promise<void> {
        await api.delete(`/Wishlist/${id}`);
    },

    async markAsPurchased(id: number, data: AddGameFormData): Promise<UserCollectionItem> {

        const payload = {
            title: data.title,
            platform: data.platform,
            condition: data.condition,
            pricePaid: data.pricePaid,
            purchaseDate: data.purchaseDate,
            notes: data.notes
        };

        const response = await api.post<UserCollectionItem>(`/Wishlist/${id}/purchase`, payload);
        return response.data;
    }
};

export const reviewsApi = {
    async fetchReviews(): Promise<Review[]> {
        const response = await api.get<Review[]>('/Reviews');
        return response.data;
    },

    async fetchReviewByGame(userCollectionItemId: number): Promise<Review> {
        const response = await api.get<Review>(`/Reviews/game/${userCollectionItemId}`);
        return response.data;
    },

    async createReview(data: ReviewFormData): Promise<Review> {
        const response = await api.post<Review>('/Reviews', data);
        return response.data;
    },

    async updateReview(id: number, data: Partial<ReviewFormData>): Promise<Review> {
        const response = await api.put<Review>(`/Reviews/${id}`, data);
        return response.data;
    },

    async deleteReview(id: number): Promise<void> {
        await api.delete(`/Reviews/${id}`);
    }
};
