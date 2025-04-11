<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\SendAppointmentReminders;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(SendAppointmentReminders::class)
    ->everyMinute()
    ->withoutOverlapping()
    ->onSuccess(function () {
        info('Rappel de rendez-vous envoyé avec succès.');
    })
    ->onFailure(function () {
        error_log('Échec de l\'envoi du rappel de rendez-vous.');
    });


/* Schedule::command('appointments:remind')
    ->everyMinute()
    ->withoutOverlapping()
    ->onSuccess(function () {
        info('Rappel de rendez-vous envoyé avec succès.');
    })
    ->onFailure(function () {
        error_log('Échec de l\'envoi du rappel de rendez-vous.');
    }); */
