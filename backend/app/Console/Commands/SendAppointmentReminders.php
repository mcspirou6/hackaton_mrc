<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentReminder;
use App\Mail\AppointmentReminderPatient;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:remind';
    protected $description = 'Envoie un rappel aux patients et médecins 15 minutes avant leur rendez-vous';

    public function handle(): void
    {
        $now = Carbon::now();
        $target = $now->copy()->addMinute(); // Rappel 1 min avant

        // Debug pour vérifier l'heure ciblée
        $this->info('Date ciblée : ' . $target->format('Y-m-d'));
        $this->info('Heure ciblée : ' . $target->format('H:i:s'));

        logger("Recherche des RDV pour : $date à $time");

        $appointments = Appointment::with(['patient', 'doctor'])
            ->where('date', $target->format('Y-m-d'))
            ->where('time', $target->format('H:i:s')) // ⚠️ format 16:30:00
            ->get();
            

        foreach ($appointments as $appointment) {
            // 🔹 Récupération du médecin
            $doctor = User::where('id', $appointment->user_id)->where('role', 'medecin')->first();

            // 🔹 Récupération du patient (depuis users via le nom, ou tout autre mapping propre si tu as)
            $patient = $appointment->patient?->user;
                /* ->where('last_name', $appointment->patient->last_name)
                ->where('role', 'patient')
                ->first(); */

            // 🔸 Envoi au médecin
            if ($doctor && $doctor->email) {
                Mail::to($doctor->email)->send(new AppointmentReminder($appointment));
                $this->info("Rappel envoyé au médecin : " . $doctor->email);
            } else {
                $this->warn("Aucun email trouvé pour le médecin de l'appointment ID {$appointment->id}");
            }

            // 🔸 Envoi au patient
            if ($patient && $patient->email) {
                Mail::to($patient->email)->send(new AppointmentReminderPatient($appointment));
                $this->info("Rappel envoyé au patient : " . $patient->email);
            } else {
                $this->warn("Aucun email trouvé pour le patient de l'appointment ID {$appointment->id}");
            }
        }

        $this->info("✔ Tous les rappels ont été traités.");
    }
}
