import AdminBox from '@elements/AdminBox';
import ToggleFeatureButton from './ToggleFeatureButton';

export default () => {
    //

    return (
        <div className={'grid lg:grid-cols-5 gap-4'}>
            <AdminBox title={'Disable Billing Module'} className={'col-span-2'}>
                Clicking the button below will disable all modules of the billing system - such as subscriptions, server
                purchasing and more. Make sure that this will not impact your users before disabling.
                <div className={'text-right mt-2'}>
                    <ToggleFeatureButton />
                </div>
            </AdminBox>
        </div>
    );
};
