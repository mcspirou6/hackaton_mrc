<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Mail\AppointmentReminder;
use Illuminate\Support\Facades\Mail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendAppointmentReminder implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $now = now()->addMinutes(15); // On cherche les rdv 15 min après l'heure actuelle

        $appointments = Appointment::with(['doctor', 'patient'])
            ->where('status', 'Confirmé')
            ->where('date', $now->toDateString())
            ->where('time', $now->format('H:i:00'))
            ->get();

        foreach ($appointments as $appointment) {
            Mail::to($appointment->doctor->email)->send(new AppointmentReminder($appointment));
            Mail::to($appointment->patient->email)->send(new AppointmentReminderPatient($appointment));
        }
    }
}
