import { Order } from '@/api/billing/orders';
import { Product } from '@/api/billing/products';
import http from '@/api/http';
import { Category } from '@/api/billing/getCategories';

export interface BillingAnalytics {
    orders: Order[];
    products: Product[];
    categories: Category[];
}

export const getBillingAnalytics = (): Promise<BillingAnalytics> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/application/billing/analytics`)
            .then(({ data }) => {
                resolve(data || []);
            })
            .catch(reject);
    });
};
