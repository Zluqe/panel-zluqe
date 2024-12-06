import Pill, { PillStatus } from '../../elements/Pill';
import PageContentBlock from '@elements/PageContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Body, BodyItem, Header, HeaderItem, Table } from '@elements/Table';
import { useEffect, useState } from 'react';
import { getOrders, Order } from '@/api/billing/orders';
import Spinner from '@/components/elements/Spinner';
import { formatDistanceToNowStrict } from 'date-fns';

export function format(date: number): string {
    let prefix = 'th';

    switch (date) {
        case 1:
        case 21:
        case 31:
            prefix = 'st';
            break;
        case 2:
        case 22:
            prefix = 'nd';
            break;
        case 3:
            prefix = 'rd';
            break;
        default:
            break;
    }

    return `${date}${prefix}`;
}

export function type(state: string): PillStatus {
    switch (state) {
        case 'processed':
            return 'success';
        case 'failed':
            return 'danger';
        case 'pending':
            return 'warn';
        default:
            return 'unknown';
    }
}

export default () => {
    const [orders, setOrders] = useState<Order[] | null>();

    useEffect(() => {
        getOrders()
            .then(data => setOrders(data))
            .catch(error => console.log(error));
    }, []);

    if (!orders) return <Spinner size={'small'} centered />;

    return (
        <PageContentBlock>
            <div className={'text-3xl lg:text-5xl font-bold mt-8 mb-12'}>
                Billing Activity
                <p className={'text-gray-400 font-normal text-sm mt-1'}>
                    View and manage the active and previous subscriptions you&apos;ve created.
                </p>
                <FlashMessageRender byKey={'billing:plans'} className={'mt-4'} />
            </div>
            <div className={'text-gray-400 text-center'}>
                <Table>
                    <Header>
                        <HeaderItem>Name</HeaderItem>
                        <HeaderItem>Price</HeaderItem>
                        <HeaderItem>Description</HeaderItem>
                        <HeaderItem>Created At</HeaderItem>
                        <HeaderItem>Payment State</HeaderItem>
                        <HeaderItem>&nbsp;</HeaderItem>
                    </Header>
                    <Body>
                        {orders.map(order => (
                            <BodyItem
                                item={order.name.split('-')[0]!.toString()}
                                key={1}
                                to={`/billing/order/${order.product_id}`}
                            >
                                <td className={'px-6 py-4 text-white font-bold'}>${order.total}/mo</td>
                                <td className={'px-6 py-4'}>{order.description}</td>
                                <td className={'px-6 py-4'}>
                                    {formatDistanceToNowStrict(order.created_at, { addSuffix: true })}
                                </td>
                                <td className={'px-6 py-4 text-left'}>
                                    <Pill small type={type(order.status)}>
                                        {order.status}
                                    </Pill>
                                </td>
                                <td className={'pr-12 py-4 text-right'}>
                                    <Pill small type={order.is_renewal ? 'info' : 'success'}>
                                        {order.is_renewal ? 'Upgrade' : 'New Server'}
                                    </Pill>
                                </td>
                            </BodyItem>
                        ))}
                    </Body>
                </Table>
            </div>
        </PageContentBlock>
    );
};
