import { useState } from 'react';
import AdminBox from '@elements/AdminBox';
import { Button } from '@/components/elements/button';
import ToggleFeatureButton from './ToggleFeatureButton';
import { updateSettings } from '@/api/admin/billing/settings';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useStoreActions, useStoreState } from '@/state/hooks';
import { faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons';
import SetupPayPal from './guides/SetupPayPal';
import SetupLink from './guides/SetupLink';

export type BillingSetupDialog = 'paypal' | 'link' | 'none';

export default () => {
    const settings = useStoreState(s => s.everest.data!.billing);
    const updateEverest = useStoreActions(s => s.everest.updateEverest);
    const [open, setOpen] = useState<BillingSetupDialog>('none');

    const submit = (key: string, value: boolean) => {
        updateSettings(key, value).then(() => {
            updateEverest({ billing: { ...settings, [key]: value } });
        });
    };

    return (
        <div className={'grid lg:grid-cols-3 gap-4'}>
            {open === 'paypal' && <SetupPayPal setOpen={setOpen} />}
            {open === 'link' && <SetupLink setOpen={setOpen} />}
            <AdminBox title={'Add PayPal integration'} icon={faPaypal}>
                Adding PayPal to Jexactyl allows users to purchase products via another channel, improving order success
                rate and global payment availability.
                <p className={'text-gray-400 mt-2'}>
                    PayPal module is currently{' '}
                    <span className={settings.paypal ? 'text-green-500' : 'text-red-500'}>
                        {settings.paypal ? 'enabled' : 'disabled'}
                    </span>
                    .
                </p>
                <div className={'text-right mt-2'}>
                    {settings.paypal && (
                        <Button.Text
                            className={'mr-2'}
                            onClick={() => setOpen('paypal')}
                            variant={Button.Variants.Secondary}
                        >
                            Setup Instructions
                        </Button.Text>
                    )}
                    <Button.Text onClick={() => submit('paypal', !settings.paypal)}>
                        {settings.paypal ? 'Disable' : 'Enable'}
                    </Button.Text>
                </div>
            </AdminBox>
            <AdminBox title={'Add Link integration'} icon={faStripe}>
                Adding Link to Jexactyl allows users to purchase products via another channel, improving order success
                rate and global payment availability.
                <p className={'text-gray-400 mt-2'}>
                    Link module is currently{' '}
                    <span className={settings.link ? 'text-green-500' : 'text-red-500'}>
                        {settings.link ? 'enabled' : 'disabled'}
                    </span>
                    .
                </p>
                <div className={'text-right mt-2'}>
                    {settings.link && (
                        <Button.Text
                            className={'mr-2'}
                            onClick={() => setOpen('link')}
                            variant={Button.Variants.Secondary}
                        >
                            Setup Instructions
                        </Button.Text>
                    )}
                    <Button.Text onClick={() => submit('link', !settings.link)}>
                        {settings.link ? 'Disable' : 'Enable'}
                    </Button.Text>
                </div>
            </AdminBox>
            <AdminBox title={'Disable Billing Module'} icon={faPowerOff}>
                Clicking the button below will disable all modules of the billing system - such as subscriptions, server
                purchasing and more. Make sure that this will not impact your users before disabling.
                <div className={'text-right mt-3'}>
                    <ToggleFeatureButton />
                </div>
            </AdminBox>
        </div>
    );
};
