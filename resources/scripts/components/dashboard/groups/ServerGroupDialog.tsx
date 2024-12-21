import { Dialog } from '@elements/dialog';
import { Button } from '@elements/button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteServerGroup, getServerGroups, ServerGroup } from '@/api/server/groups';
import ModifyServerGroup from '@/components/dashboard/groups/ModifyServerGroup';
import Pill from '@/components/elements/Pill';
import Spinner from '@/components/elements/Spinner';
import { Dropdown } from '@/components/elements/dropdown';

export type VisibleDialog = 'index' | 'modify' | 'delete' | 'none';

interface Props {
    open: VisibleDialog;
    groups: ServerGroup[];
    setOpen: Dispatch<SetStateAction<VisibleDialog>>;
    setGroups: Dispatch<SetStateAction<ServerGroup[]>>;
}

export default ({ open, setOpen, groups, setGroups }: Props) => {
    const [group, setGroup] = useState<ServerGroup | undefined>();

    useEffect(() => {
        getServerGroups().then(data => setGroups(data));
    }, [open === 'index']);

    const onDelete = (id: number) => {
        deleteServerGroup(id).then(() => {
            setOpen('none');
        });
    };

    if (!groups) return <Spinner size={'large'} centered />;

    return (
        <>
            <ModifyServerGroup open={open === 'modify'} group={group} setOpen={setOpen} />
            {open === 'index' && (
                <Dropdown>
                    <Dropdown.Button>Item</Dropdown.Button>
                    <Dropdown.Item>Item</Dropdown.Item>
                </Dropdown>
            )}
            <Dialog open={false} onClose={() => setOpen('none')} title={'Server Group Configuration'}>
                <div className={'absolute top-4 right-16'}>
                    <Button size={Button.Sizes.Small} onClick={() => setOpen('modify')}>
                        <FontAwesomeIcon icon={faPlus} className={'mr-1'} /> Create
                    </Button>
                </div>
                {groups ? (
                    <div className={'my-3 grid grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer'}>
                        {groups?.map(group => (
                            <Pill size={'large'} key={group.id} type={'unknown'}>
                                <div
                                    key={group.id}
                                    onClick={() => {
                                        setGroup(group);
                                        setOpen('modify');
                                    }}
                                >
                                    <span style={{ color: group.color }}>{group.name}</span>
                                </div>
                                <div
                                    onClick={() => onDelete(group.id)}
                                    className={
                                        'absolute right-4 my-auto text-red-500/75 hover:text-red-400 transition duration-250'
                                    }
                                >
                                    <FontAwesomeIcon icon={faTrash} size={'sm'} />
                                </div>
                            </Pill>
                        ))}
                    </div>
                ) : (
                    <div className={'text-gray-400 mt-4 text-center font-semibold'}>
                        No groups exist on this account.
                    </div>
                )}
            </Dialog>
        </>
    );
};
