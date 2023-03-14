export interface IUser {
    _id: string;
    name: string;
    email: string;
    username: string;
    isAdmin: boolean;
    wallet: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    wishlist: string[];
    phone?: string;
    avatar?: string;
}
