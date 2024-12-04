import { FormEvent } from "react";
import useFlash from "@/plugins/useFlash";
import { Product } from "@/api/billing/getProducts";
import { Button } from "@/components/elements/button"
import FlashMessageRender from "@/components/FlashMessageRender"
import { PaymentIntent, updateIntent } from "@/api/billing/intent";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

interface Props {
    selectedNode?: number;
    product: Product;
    vars: Map<string, string>;
    intent: PaymentIntent;
}

export default (data: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const { clearFlashes } = useFlash();

    const handleSubmit = async (event: FormEvent) => {
        clearFlashes();
        event.preventDefault();

        if (!stripe || !elements || !data.product || !data.selectedNode) return;

        const variables = Array.from(data.vars, ([key, value]) => ({ key, value }));

        await updateIntent({ id: Number(data.product.id), intent: data.intent.id, node_id: data.selectedNode!, vars: variables })
            .then(() => {
                stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: window.location.href + '/processing',
                    },
                })
            })
    };

    return (
        <form className={'bg-gray-900'} onSubmit={handleSubmit}>
            <PaymentElement />
            <FlashMessageRender byKey={'store:order'} className={'mb-4'} />
            <div className={'text-right'}>
                <Button disabled={!data.selectedNode}>
                    Pay Now
                </Button>
            </div>
        </form>
    )
}