<?php

namespace Everest\Http\Controllers\Api\Client;

use Everest\Models\ServerGroup;
use Illuminate\Http\JsonResponse;
use Everest\Http\Requests\Api\Client\ClientApiRequest;
use Everest\Transformers\Api\Client\ServerGroupTransformer;

class ServerGroupController extends ClientApiController
{
    /**
     * Returns all the API keys that exist for the given client.
     */
    public function index(ClientApiRequest $request): array
    {
        return $this->fractal->collection($request->user()->serverGroups)
            ->transformWith(ServerGroupTransformer::class)
            ->toArray();
    }

    /**
     * Create a new server group and store in the database.
     */
    public function store(ClientApiRequest $request): array
    {    
        $group = ServerGroup::create([
            'user_id' => $request->user()->id,
            'name' => $request->input('name'),
            'color' => $request->input('color') ?? null,
        ]);

        return $this->fractal->item($group)
            ->transformWith(ServerGroupTransformer::class)
            ->toArray();
    }

    /**
     * Update a selected server group.
     */
    public function update(ClientApiRequest $request, int $id): JsonResponse
    {
        $group = ServerGroup::findOrFail($id);

        $group->update([
            'name' => $request['name'] ?? $group->name,
            'color' => $request['color'] ?? $group->color,
        ]);

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    /**
     * Delete a selected server group.
     */
    public function delete(ClientApiRequest $request, int $id): JsonResponse
    {
        $group = ServerGroup::findOrFail($id);

        $group->delete();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
