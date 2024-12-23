import Input from '@/components/elements/Input';
import { useStoreState } from '@/state/hooks';
import { Dialog } from '@elements/dialog';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@elements/tooltip/Tooltip';
import { useState } from 'react';
import { Button } from '@/components/elements/button';
import { updateSettings } from '@/api/admin/billing/settings';

interface StripeKeys {
    publishable?: string;
    secret?: string;
}

export default () => {
    const [data, setData] = useState<StripeKeys>();
    const existingKeys = useStoreState(s => s.everest.data!.billing.keys);

    const submit = async () => {
        if (!data || !data.secret || !data.publishable) return;

        updateSettings('keys:publishable', data.publishable).then(() => {
            updateSettings('keys:secret', data.secret).then(() => {
                window.location.reload();
            });
        });
    };

    return (
        <Dialog
            open={!existingKeys.publishable || !existingKeys.secret}
            onClose={() => undefined}
            hideCloseIcon
            preventExternalClose
            title={'Configure Stripe API'}
        >
            Before you can use the Stripe API, you must provide Jexactyl with API keys to authenticate with Stripe.
            Visit the Stripe dashboard
            <a
                target={'_blank'}
                rel={'noreferrer'}
                className={'text-blue-300 mx-1'}
                href={'https://dashboard.stripe.com/apikeys'}
            >
                here
            </a>
            to obtain your API key and secret key, then paste them here.
            <div className={'relative mt-4'}>
                <Input
                    placeholder={'Enter "publishable" key here...'}
                    onChange={e => setData({ ...data, publishable: e.currentTarget.value })}
                />
                {!data?.publishable || data.publishable.length < 100 || data.publishable.length > 120 ? (
                    <Tooltip placement={'right'} content={'You must enter a valid Stripe publisable key to continue.'}>
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className={'absolute top-1/3 right-4 text-yellow-500'}
                        />
                    </Tooltip>
                ) : (
                    <FontAwesomeIcon icon={faCheckCircle} className={'absolute top-1/3 right-4 text-green-500'} />
                )}
            </div>
            <div className={'relative mt-4'}>
                <Input
                    placeholder={'Enter "secret" key here...'}
                    onChange={e => setData({ ...data, secret: e.currentTarget.value })}
                />
                {!data?.secret || data.secret.length < 100 || data.secret.length > 120 ? (
                    <Tooltip placement={'right'} content={'You must enter a valid Stripe secret key to continue.'}>
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className={'absolute top-1/3 right-4 text-yellow-500'}
                        />
                    </Tooltip>
                ) : (
                    <FontAwesomeIcon icon={faCheckCircle} className={'absolute top-1/3 right-4 text-green-500'} />
                )}
            </div>
            <div className={'w-full text-right mt-4'}>
                <Button onClick={submit} disabled={!data?.secret || !data?.publishable}>
                    Submit
                </Button>
            </div>
        </Dialog>
    );
};
