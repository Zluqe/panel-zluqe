import { Order, rawDataToOrder } from '@/api/billing/orders';
import http from '@/api/http';

export const getOrders = (): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/application/billing/orders`)
            .then(({ data }) => resolve((data.data || []).map((datum: any) => rawDataToOrder(datum))))
            .catch(reject);
    });
};
