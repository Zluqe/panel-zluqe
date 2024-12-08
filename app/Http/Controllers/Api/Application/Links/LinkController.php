<?php

namespace Everest\Http\Controllers\Api\Application\Links;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Everest\Models\CustomLink;
use Everest\Transformers\Api\Application\LinkTransformer;
use Everest\Http\Controllers\Api\Application\ApplicationApiController;

class LinkController extends ApplicationApiController
{
    /**
     * LinkController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Get all links.
     */
    public function index(Request $request): array
    {
        return $this->fractal->collection(CustomLink::all())
            ->transformWith(LinkTransformer::class)
            ->toArray();
    }

    /**
     * Create a new link.
     */
    public function store(Request $request): array
    {
        $link = CustomLink::create([
            'url' => $request['url'],
            'name' => $request['name'],
            'visible' => (bool) $request['visible'],
        ]);

        return $this->fractal->item($link)
            ->transformWith(LinkTransformer::class)
            ->toArray();
    }

    /**
     * Update a selected link.
     */
    public function update(Request $request, int $id): Response
    {
        $link = CustomLink::findOrFail($id);

        $link->update([
            'url' => $request['url'],
            'name' => $request['name'],
            'visible' => (bool) $request['visible'],
        ]);

        return $this->returnNoContent();
    }

    /**
     * Delete a selected link.
     */
    public function delete(Request $request, int $id): Response
    {
        $link = CustomLink::findOrFail($id);

        $link->delete();

        return $this->returnNoContent();
    }
}
