import Spinner from '@elements/Spinner';
import { Link } from 'react-router-dom';
import { Button } from '@elements/button';
import AdminContentBlock from '@elements/AdminContentBlock';
import { useEffect, useState } from 'react';
import { Order } from '@/api/billing/orders';
import { getOrders } from '@/api/admin/billing/orders';
import OrdersTable from './OrdersTable';

export default () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        getOrders().then(data => setOrders(data));
    }, []);

    if (!orders) return <Spinner size={'large'} centered />;

    return (
        <AdminContentBlock title={'Billing Orders'}>
            <div className={'w-full flex flex-row items-center p-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>Orders</h2>
                    <p
                        className={
                            'hidden lg:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'
                        }
                    >
                        A list of the orders placed on this Panel.
                    </p>
                </div>
                <div className={'flex ml-auto pl-4'}>
                    <Link to={`/admin/billing/orders/new`}>
                        <Button>Create Order</Button>
                    </Link>
                </div>
            </div>
            <OrdersTable data={orders} />
        </AdminContentBlock>
    );
};
