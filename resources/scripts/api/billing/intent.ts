import http from '@/api/http';

export interface PaymentIntent {
    id: string;
    secret: string;
}

interface UpdatePaymentIntent {
    id: number;
    node_id: number;
    intent: string;
    vars: { key: string, value: string }[];
}

export const getIntent = (id: number): Promise<PaymentIntent> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/billing/products/${id}/intent`)
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

export const updateIntent = ({ id, intent, node_id, vars }: UpdatePaymentIntent): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.put(`/api/client/billing/products/${id}/intent`, { intent, node_id, variables: vars })
            .then(() => resolve())
            .catch(reject);
    });
};
