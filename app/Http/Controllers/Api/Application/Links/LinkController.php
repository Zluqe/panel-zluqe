<?php

namespace Everest\Http\Controllers\Api\Application\Links;

use Illuminate\Http\Request;
use Everest\Facades\Activity;
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

        Activity::event('admin:link:create')
            ->property('name', $link->name)
            ->property('url', $link->url)
            ->description('New custom link for client UI was made')
            ->log();

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

        Activity::event('admin:link:update')
            ->property('name', $link->name . ' => ' . $request['name'])
            ->property('url', $link->url . ' => ' . $request['url'])
            ->description('An existing custom link was updated')
            ->log();

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

        Activity::event('admin:link:delete')
            ->property('name', $link->name)
            ->property('url', $link->url)
            ->description('An existing custom link was deleted')
            ->log();

        return $this->returnNoContent();
    }
}
