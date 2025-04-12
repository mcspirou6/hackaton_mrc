<?php

namespace App\Http\Controllers\API\medecin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Patient;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class StatistiqueController extends Controller
{
    /**
     * Retourne les statistiques des médecins.
     *
     * @return JsonResponse
     */
    /* public function index(): JsonResponse
    {
        $medecinId = Auth::id(); // ID du médecin connecté

        // Total des patients du médecin
        $totalPatients = Patient::where('referring_doctor_id', $medecinId)->count();

        // Nombre total de rendez-vous du médecin
        $totalRendezVous = RendezVous::where('referring_doctor_id', $medecinId)->count();

        // Nombre total de patients critiques (exemple : où le status = "critique")
        $totalPatientsCritiques = Patient::where('referring_doctor_id', $medecinId)
                                         ->where('status', 'critique')
                                         ->count();

        return response()->json([
            'success' => true,
            'data' => [
            'total_patients_medecin' => $totalPatients,
            'total_rendez_vous' => $totalRendezVous,
            'total_patients_critiques' => $totalPatientsCritiques,
            ]
        ]);
    } */

    public function index(): JsonResponse
    {
        $medecinId = Auth::id();

        Log::info('ID médecin connecté : ' . $medecinId);

        if (!$medecinId) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié.',
            ], 401);
        }

        $medecin = User::where('role', 'medecin')->find($medecinId);


        if ($medecin) {
            $totalRendezVous = $medecin->appointments()->count();
        }

        $totalPatients = Patient::where('referring_doctor_id', $medecinId)->count();
        $totalPatientsCritiques = Patient::where('referring_doctor_id', $medecinId)
                                 ->where('status', 'Critique')
                                 ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_patients_medecin' => $totalPatients,
                'total_rendez_vous' => $totalRendezVous,
                'total_patients_critiques' => $totalPatientsCritiques,
            ]
        ]);
    }

}
