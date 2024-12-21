import { useEffect, useState } from 'react';
import Spinner from '@elements/Spinner';
import usePagination from '@/plugins/usePagination';
import { CustomLink, getLinks } from '@/api/admin/links';
import { NoItems } from '@elements/AdminTable';
import { Table, Header, HeaderItem, Body, BodyItem, PaginatedFooter } from '@elements/Table';
import { formatDistanceToNowStrict } from 'date-fns';
import AdminContentBlock from '@elements/AdminContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Button } from '@elements/button';
import CreateLinkDialog from './CreateLinkDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pill from '@elements/Pill';
import DeleteLinkDialog from './DeleteLinkDialog';

export type VisibleDialog = 'none' | 'create' | 'update' | 'delete';

export default () => {
    const [links, setLinks] = useState<CustomLink[]>([]);
    const [selectedLink, setSelectedLink] = useState<CustomLink | null>();

    const [open, setOpen] = useState<VisibleDialog>('none');

    useEffect(() => {
        getLinks().then(data => setLinks(data));
    }, [open]);

    if (!links) return <Spinner centered />;

    const pagination = usePagination<CustomLink>(links, 10);

    return (
        <AdminContentBlock title={'Custom Links'}>
            {open === 'create' && <CreateLinkDialog setOpen={setOpen} />}
            {open === 'update' && selectedLink && <CreateLinkDialog link={selectedLink} setOpen={setOpen} />}
            {open === 'delete' && <DeleteLinkDialog id={selectedLink?.id} setOpen={setOpen} />}
            <FlashMessageRender byKey={'admin:links'} className={'mb-4'} />
            <div className={'w-full flex flex-row items-center mb-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>Custom Links</h2>
                    <p
                        className={
                            'hidden lg:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'
                        }
                    >
                        Create custom links to external sites for clients.
                    </p>
                </div>
                <div className={'flex ml-auto pl-4'}>
                    <Button onClick={() => setOpen('create')}>New Link</Button>
                </div>
            </div>
            <Table>
                <Header>
                    <HeaderItem>Name</HeaderItem>
                    <HeaderItem>URL</HeaderItem>
                    <HeaderItem>Visible</HeaderItem>
                    <HeaderItem>Created At</HeaderItem>
                    <HeaderItem>Updated At</HeaderItem>
                    <HeaderItem>&nbsp;</HeaderItem>
                </Header>
                <Body>
                    {pagination.paginatedItems.map(link => (
                        <BodyItem item={link.name} key={link.id}>
                            <td className={'px-6 py-4 text-white font-bold'}>{link.url}</td>
                            <td className={'px-6 py-4'}>
                                {link.visible ? (
                                    <Pill type={'success'}>Visible</Pill>
                                ) : (
                                    <Pill type={'warn'}>Hidden</Pill>
                                )}
                            </td>
                            <td className={'px-6 py-4'}>
                                {formatDistanceToNowStrict(link.createdAt, { addSuffix: true })}
                            </td>
                            <td className={'px-6 py-4'}>
                                {link.updatedAt
                                    ? formatDistanceToNowStrict(link.updatedAt, { addSuffix: true })
                                    : 'N/A'}
                            </td>
                            <td className={'px-6 py-4 text-right space-x-3'}>
                                <Button
                                    onClick={() => {
                                        setSelectedLink(link);
                                        setOpen('update');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPencil} className={'text-white'} />
                                </Button>
                                <Button.Danger
                                    onClick={() => {
                                        setSelectedLink(link);
                                        setOpen('delete');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button.Danger>
                            </td>
                        </BodyItem>
                    ))}
                </Body>
            </Table>
            {links.length < 1 ? <NoItems /> : <PaginatedFooter pagination={pagination} />}
        </AdminContentBlock>
    );
};
