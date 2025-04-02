<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    /**
     * Affiche la liste des rendez-vous.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['patient', 'doctor']);
        
        // Filtrer par médecin si spécifié
        if ($request->has('doctor_id')) {
            $query->where('user_id', $request->doctor_id);
        }
        
        // Filtrer par patient si spécifié
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }
        
        // Filtrer par statut si spécifié
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filtrer par date si spécifiée
        if ($request->has('date')) {
            $date = $request->date;
            $query->whereDate('scheduled_at', $date);
        }
        
        $appointments = $query->orderBy('scheduled_at', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Enregistre un nouveau rendez-vous.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validation des données
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'user_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date',
            'status' => 'required|string|in:scheduled,completed,canceled,no_show',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Vérifier si le médecin est disponible à cette heure
        $conflictingAppointment = Appointment::where('user_id', $validated['user_id'])
            ->where('scheduled_at', $validated['scheduled_at'])
            ->where('status', 'scheduled')
            ->first();
            
        if ($conflictingAppointment) {
            return response()->json([
                'success' => false,
                'message' => 'Le médecin a déjà un rendez-vous à cette heure.'
            ], 422);
        }

        $appointment = Appointment::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous créé avec succès',
            'data' => $appointment
        ], 201);
    }

    /**
     * Affiche les détails d'un rendez-vous spécifique.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    /**
     * Met à jour les informations d'un rendez-vous.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        
        // Validation des données
        $validated = $request->validate([
            'patient_id' => 'sometimes|exists:patients,id',
            'user_id' => 'sometimes|exists:users,id',
            'scheduled_at' => 'sometimes|date',
            'status' => 'sometimes|string|in:scheduled,completed,canceled,no_show',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Vérifier les conflits de rendez-vous si la date ou le médecin change
        if (($request->has('scheduled_at') || $request->has('user_id')) && $request->status !== 'canceled') {
            $doctorId = $request->has('user_id') ? $request->user_id : $appointment->user_id;
            $scheduledAt = $request->has('scheduled_at') ? $request->scheduled_at : $appointment->scheduled_at;
            
            $conflictingAppointment = Appointment::where('user_id', $doctorId)
                ->where('scheduled_at', $scheduledAt)
                ->where('status', 'scheduled')
                ->where('id', '!=', $id)
                ->first();
                
            if ($conflictingAppointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le médecin a déjà un rendez-vous à cette heure.'
                ], 422);
            }
        }

        $appointment->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous mis à jour avec succès',
            'data' => $appointment
        ]);
    }

    /**
     * Supprime un rendez-vous.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous supprimé avec succès'
        ]);
    }

    /**
     * Retourne les statistiques des rendez-vous.
     *
     * @return JsonResponse
     */
    public function statistics(): JsonResponse
    {
        $totalAppointments = Appointment::count();
        $completedAppointments = Appointment::where('status', 'completed')->count();
        $canceledAppointments = Appointment::where('status', 'canceled')->count();
        $noShowAppointments = Appointment::where('status', 'no_show')->count();
        $upcomingAppointments = Appointment::where('status', 'scheduled')
            ->where('scheduled_at', '>=', now())
            ->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_appointments' => $totalAppointments,
                'completed_appointments' => $completedAppointments,
                'canceled_appointments' => $canceledAppointments,
                'no_show_appointments' => $noShowAppointments,
                'upcoming_appointments' => $upcomingAppointments,
                'completion_rate' => $totalAppointments > 0 ? round(($completedAppointments / $totalAppointments) * 100, 2) : 0
            ]
        ]);
    }
}
