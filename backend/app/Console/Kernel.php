<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    // Enregistre ta commande personnalisée
    protected $commands = [
        \App\Console\Commands\SendAppointmentReminders::class,
    ];

    // Planifie l’exécution de la commande
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('appointments:remind')->everyMinute(); // pour test rapide
    }

    // Si besoin, tu peux charger d’autres fichiers de commandes ici
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
    }
}
