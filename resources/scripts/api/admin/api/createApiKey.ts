import http from '@/api/http';
import { Transformers, type ApiKey } from '@/api/definitions/admin';
import { ApiKeyPermission } from '@/api/definitions/admin';

export default (values: { memo: string; permissions: ApiKeyPermission }): Promise<ApiKey> => {
    return new Promise((resolve, reject) => {
        http.post('/api/application/api', values)
            .then(({ data }) => resolve(Transformers.toApiKey(data)))
            .catch(reject);
    });
};
