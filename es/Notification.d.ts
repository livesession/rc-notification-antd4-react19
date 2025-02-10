import * as React from 'react';
import { Component, Key } from 'react';
import { NoticeProps } from './Notice';
export interface NoticeContent extends Omit<NoticeProps, 'prefixCls' | 'children'> {
    prefixCls?: string;
    key?: React.Key;
    updateMark?: string;
    content?: React.ReactNode;
}
export type NoticeFunc = (noticeProps: NoticeContent) => void;
export type HolderReadyCallback = (div: HTMLDivElement, noticeProps: NoticeProps & {
    key: React.Key;
}) => void;
export interface NotificationInstance {
    notice: NoticeFunc;
    removeNotice: (key: React.Key) => void;
    destroy: () => void;
    component: Notification;
    useNotification: () => [NoticeFunc, React.ReactElement];
}
export interface NotificationProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    transitionName?: string;
    animation?: string | object;
    maxCount?: number;
    closeIcon?: React.ReactNode;
}
interface NotificationState {
    notices: {
        notice: NoticeContent;
        holderCallback?: HolderReadyCallback;
    }[];
}
declare class Notification extends Component<NotificationProps, NotificationState> {
    static newInstance: (properties: NotificationProps & {
        getContainer?: () => HTMLElement;
    }, callback: (instance: NotificationInstance) => void) => void;
    static defaultProps: {
        prefixCls: string;
        animation: string;
        style: {
            top: number;
            left: string;
        };
    };
    state: NotificationState;
    private hookRefs;
    getTransitionName(): string;
    add: (originNotice: NoticeContent, holderCallback?: HolderReadyCallback) => void;
    remove: (key: React.Key) => void;
    noticePropsMap: Record<any, {
        props: NoticeProps & {
            key: any;
        };
        holderCallback?: HolderReadyCallback;
    }>;
    render(): React.JSX.Element;
}
export default Notification;
