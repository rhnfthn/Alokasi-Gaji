export type RequestUser = {
    sub: string;
    email: string;
    role: 'USER' | 'ADMIN';
};
