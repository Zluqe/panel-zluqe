import { Dialog } from '@elements/dialog';
import { VisibleDialog } from './LinksTable';
import { deleteLink } from '@/api/admin/links';
import { Dispatch, SetStateAction } from 'react';
import Spinner from '@elements/Spinner';

export default ({ id, setOpen }: { id?: number; setOpen: Dispatch<SetStateAction<VisibleDialog>> }) => {
    if (!id) return <Spinner centered />;

    const onSubmit = () => {
        deleteLink(id).then(() => setOpen('none'));
    };

    return (
        <Dialog.Confirm
            confirm={'Delete'}
            onConfirmed={onSubmit}
            open
            onClose={() => setOpen('none')}
            title={'Delete custom link'}
        >
            <div className={'mt-2'}>
                Are you sure you wish to delete this custom link? Users will no longer be able to use it.
            </div>
        </Dialog.Confirm>
    );
};
