import http from '@/api/http';

export const deleteStripeKeys = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.delete(`/api/application/billing/keys`)
            .then(() => resolve())
            .catch(reject);
    });
};
