import Pill, { PillStatus } from '../../elements/Pill';
import PageContentBlock from '@elements/PageContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Body, BodyItem, Header, HeaderItem, Table } from '@elements/Table';

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
        case 'paid':
            return 'success';
        case 'arrears':
        case 'cancelled':
        case 'terminated':
            return 'danger';
        case 'processing':
        case 'due':
            return 'warn';
        default:
            return 'unknown';
    }
}

export default () => {
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
                            <HeaderItem>Bill Date</HeaderItem>
                            <HeaderItem>Description</HeaderItem>
                            <HeaderItem>&nbsp;</HeaderItem>
                        </Header>
                        <Body>
                                <BodyItem item={'Example Order'} key={1} to={`/billing/orders/1`}>
                                    <td className={'px-6 py-4 text-white'}>$14.00/mo</td>
                                    <td className={'px-6 py-4'}>{format(31)} of month</td>
                                    <td className={'px-6 py-4'}>This is a server plan.</td>
                                    <td className={'pr-12 py-4 text-right'}>
                                        <Pill type={type('cancelled')}>Expired</Pill>
                                    </td>
                                </BodyItem>
                        </Body>
                    </Table>
            </div>
        </PageContentBlock>
    );
};
