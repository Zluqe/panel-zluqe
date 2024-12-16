import { Dialog } from '@elements/dialog';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { VisibleDialog } from './ServerGroupDialog';
import { createServerGroup, ServerGroup, updateServerGroup, Values } from '@/api/server/groups';
import InputField from '@elements/inputs/InputField';
import Label from '@elements/Label';

export default ({
    open,
    group,
    setOpen,
}: {
    group?: ServerGroup;
    open?: boolean;
    setOpen: Dispatch<SetStateAction<VisibleDialog>>;
}) => {
    const [values, setValues] = useState<Values>({
        name: group?.name ?? '',
        color: group?.color ?? '',
    });

    const onSubmit = () => {
        if (group?.id) {
            updateServerGroup(group.id, values).then(() => {
                setOpen('index');
                return;
            });
        } else {
            createServerGroup(values).then(() => {
                setOpen('index');
                return;
            });
        }
    };

    const updateValues = (e: FormEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [e.currentTarget?.name]: e.currentTarget?.value } as Values));
    };

    return (
        <Dialog.Confirm
            open={!!open}
            onClose={() => setOpen('index')}
            title={group ? `Modify ${group.name}` : 'Create new group'}
            preventExternalClose
            subDialog
            onConfirmed={onSubmit}
            confirm={group ? 'Update' : 'Create'}
        >
            <div className={'mt-4'}>
                <Label>Group Name</Label>
                <InputField defaultValue={group?.name} name={'name'} onChange={updateValues}></InputField>
                <p className={'text-gray-400 text-sm mt-1'}>Provide a name for this server group.</p>
            </div>
            <div className={'mt-2'}>
                <Label>Group Color</Label>
                <InputField
                    type={'color'}
                    name={'color'}
                    onChange={updateValues}
                    defaultValue={group?.color}
                ></InputField>
                <p className={'text-gray-400 text-sm mt-1'}>This is the hex value of the group color.</p>
            </div>
        </Dialog.Confirm>
    );
};
