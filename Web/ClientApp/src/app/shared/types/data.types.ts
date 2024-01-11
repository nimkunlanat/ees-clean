import { ModalResolve } from "../components/modal/modal.resolver";

export type NotifyPosition = "tl" | "tc" | "tr" | "bl" | "bc" | "br"

export type ModalConfig = {
    content: any;
    data?: any;
    header?: string;
    width?: string;
    size?: number;
    baseZIndex?: number;
    maximizable?: boolean;
    closable?: boolean;
    resolver?: ModalResolve<any>;
    resolverParam?: any;
    position?: string;
}

export enum RowState {
    Normal, Add, Edit, Delete
}

export enum AttachmentType {
    Image = "Image",
    File = "File"
}

export enum Category {
    Defalt = "default"
}