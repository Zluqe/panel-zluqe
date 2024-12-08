import http, { FractalResponseData } from '@/api/http';

export interface CustomLink {
    id: number;
    name: string;
    url: string;
    visible: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
}

export interface Values {
    url: string;
    name: string;
    visible: boolean;
}

export const rawDataToLink = ({ attributes: data }: FractalResponseData): CustomLink => ({
    id: data.id,
    name: data.name,
    url: data.url,
    visible: data.visible,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
});

export const getLinks = (): Promise<CustomLink[]> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/application/links`)
            .then(({ data }) => resolve((data.data || []).map((datum: any) => rawDataToLink(datum))))
            .catch(reject);
    });
};

export const createLink = (values: Values): Promise<CustomLink> => {
    return new Promise((resolve, reject) => {
        http.post('/api/application/links', values)
            .then(({ data }) => resolve(rawDataToLink(data)))
            .catch(reject);
    });
};

export const updateLink = (id: number, values: Values): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.patch(`/api/application/links/${id}`, values)
            .then(() => resolve())
            .catch(reject);
    });
};

export const deleteLink = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.delete(`/api/application/links/${id}`)
            .then(() => resolve())
            .catch(reject);
    });
};
