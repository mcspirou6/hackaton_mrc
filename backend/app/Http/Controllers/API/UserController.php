<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Affiche la liste des médecins.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $users = User::where('role', 'medecin')->get();
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Enregistre un nouveau médecin.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validation des données
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'license_number' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'role' => 'required|string|in:medecin,admin',
            'status' => 'required|string|in:actif,suspendu,desactive',
        ]);

        // Hashage du mot de passe
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Médecin créé avec succès',
            'data' => $user
        ], 201);
    }

    /**
     * Affiche les détails d'un médecin spécifique.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with('patients')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Met à jour les informations d'un médecin.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        // Validation des données
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'license_number' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'status' => 'sometimes|string|in:actif,suspendu,desactive',
        ]);

        // Si un nouveau mot de passe est fourni, le hasher
        if ($request->has('password') && !empty($request->password)) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Médecin mis à jour avec succès',
            'data' => $user
        ]);
    }

    /**
     * Supprime un médecin.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        // Vérifier si le médecin a des patients assignés
        if ($user->patients()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ce médecin a des patients assignés. Veuillez les réassigner avant de supprimer ce médecin.'
            ], 400);
        }
        
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Médecin supprimé avec succès'
        ]);
    }

    /**
     * Retourne les statistiques des médecins.
     *
     * @return JsonResponse
     */
    public function statistics(): JsonResponse
    {
        $totalDoctors = User::where('role', 'medecin')->count();
        $activeDoctors = User::where('role', 'medecin')->where('status', 'actif')->count();
        
        // Calculer le nombre total de patients
        $totalPatients = \App\Models\Patient::count();
        
        // Calculer le nombre moyen de patients par médecin
        $averagePatientsPerDoctor = $totalDoctors > 0 ? $totalPatients / $totalDoctors : 0;
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_doctors' => $totalDoctors,
                'active_doctors' => $activeDoctors,
                'total_patients' => $totalPatients,
                'average_patients_per_doctor' => round($averagePatientsPerDoctor, 2)
            ]
        ]);
    }
}
