<?php

namespace Everest\Console\Commands\Billing;

use Everest\Models\Server;
use Illuminate\Console\Command;
use Everest\Services\Servers\SuspensionService;

class ProcessBillableServersCommand extends Command
{
    protected $description = 'An automated task to suspend and delete billable servers.';

    protected $signature = 'p:billing:process-billable-servers';

    /**
     * ProcessBillableServersCommand constructor.
     */
    public function __construct(private SuspensionService $suspend)
    {
        parent::__construct();
    }

    /**
     * Handle command execution.
     */
    public function handle()
    {
        foreach (Server::whereNotNull('order_id')->get() as $server) {
            $count = $server->days_until_renewal - 1;

            $server->update(['days_until_renewal' => $count]);

            if ($count <= -7) {
                $server->delete();
            };

            if ($count <= 0) {
                $this->suspend->toggle($server, 'suspend');
            };
        }
    }
}
