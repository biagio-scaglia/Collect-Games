export interface Game {
    id: number;
    title: string;
    platform: string;
    normalizedTitle: string;
    wikipediaSlug?: string;
    releaseYear?: number;
    consoleId?: number;
    console?: Console;
}

export interface UserCollectionItem {
    id: number;
    gameId: number;
    game?: Game;
    condition: string;
    pricePaid?: number;
    purchaseDate?: string;
    notes?: string;
    userImagePath?: string;
    addedDate: string;
}

export interface Console {
    id: number;
    name: string;
    manufacturer: string;
    releaseYear?: number;
    generation?: number;
}

export interface AddGameFormData {
    title: string;
    platform: string;
    condition: string;
    pricePaid?: number;
    purchaseDate?: string;
    notes?: string;
    image?: File;
}

export interface WishlistItem {
    id: number;
    title: string;
    platform: string;
    imageUrl?: string;
    purchaseLink?: string;
    estimatedPrice?: number;
    notes?: string;
    priority: 'Low' | 'Medium' | 'High';
    addedDate: string;
}

export interface WishlistFormData {
    title: string;
    platform: string;
    imageUrl?: string;
    purchaseLink?: string;
    estimatedPrice?: number;
    notes?: string;
    priority: 'Low' | 'Medium' | 'High';
    image?: File;
}

export interface Review {
    id: number;
    userCollectionItemId: number;
    userCollectionItem?: UserCollectionItem;
    rating: number; // 1-5
    reviewText: string;
    reviewDate: string;
    updatedDate?: string;
}

export interface ReviewFormData {
    userCollectionItemId: number;
    rating: number;
    reviewText: string;
}
