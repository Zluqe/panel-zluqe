import http from '@/api/http';

export default (intent: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/billing/process`, { intent })
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};
