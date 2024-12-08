import { Order } from '@/api/billing/orders';
import Spinner from '@/components/elements/Spinner';
import usePagination from '@/plugins/usePagination';
import { formatDistanceToNowStrict } from 'date-fns';
import { NoItems } from '@/components/elements/AdminTable';
import Pill, { PillStatus } from '@/components/elements/Pill';
import { Body, BodyItem, Header, HeaderItem, PaginatedFooter, Table } from '@/components/elements/Table';

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
        case 23:
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

export default ({ data }: { data?: Order[] }) => {
    if (!data) return <Spinner centered />;

    const pagination = usePagination<Order>(data, 10);

    return (
        <>
            <Table>
                <Header>
                    <HeaderItem>Name</HeaderItem>
                    <HeaderItem>Price</HeaderItem>
                    <HeaderItem>Description</HeaderItem>
                    <HeaderItem>Created At</HeaderItem>
                    <HeaderItem>Payment State</HeaderItem>
                    <HeaderItem>Order Type</HeaderItem>
                </Header>
                <Body>
                    {pagination.paginatedItems.map(order => (
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
            {data.length < 1 ? <NoItems /> : <PaginatedFooter pagination={pagination} />}
        </>
    );
};
