import { ReactNode } from 'react';
import classNames from 'classnames';

export type PillSize = 'normal' | 'large' | 'small';
export type PillStatus = 'success' | 'info' | 'warn' | 'danger' | 'unknown';

function getColor(type?: PillStatus): string {
    let value = 'bg-gray-100 text-gray-800';

    switch (type) {
        case 'success':
            value = 'bg-green-100 text-green-800';
            break;
        case 'info':
            value = 'bg-blue-100 text-blue-800';
            break;
        case 'warn':
            value = 'bg-yellow-100 text-yellow-800';
            break;
        case 'danger':
            value = 'bg-red-100 text-red-800';
            break;
        default:
            break;
    }

    return value;
}

export default ({
    type,
    size,
    children,
    customColor,
}: {
    type?: PillStatus;
    size?: PillSize;
    children: ReactNode;
    customColor?: string;
}) => (
    <span
        className={classNames(
            getColor(type),
            !size && 'text-xs px-2 rounded-full',
            size === 'large' && 'px-6 py-4 rounded-lg w-full',
            size === 'small' && 'text-sm px-3 py-0.5 rounded-full',
            'relative mx-1 inline-flex leading-5 font-medium capitalize',
        )}
        style={{ backgroundColor: customColor }}
    >
        {children}
    </span>
);
