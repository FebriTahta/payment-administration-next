export const baseUrl = () => {
    const isProd = process.env.NEXT_PUBLIC_STATUS_PROD === 'true';
    return isProd 
        ? process.env.NEXT_PUBLIC_BACKEND_PROD_URL 
        : process.env.NEXT_PUBLIC_BACKEND_DEMO_URL;
};

export const secretJwt = () => {
    return process.env.NEXT_PUBLIC_JWT_SECRET || 'secret';
}