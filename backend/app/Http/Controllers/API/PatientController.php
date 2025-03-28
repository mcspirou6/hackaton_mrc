<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    /**
     * Affiche la liste des patients.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // À implémenter: récupérer les patients depuis la base de données
        $patients = []; // Simuler des données pour l'instant
        
        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }

    /**
     * Enregistre un nouveau patient.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validation des données
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'age' => 'required|integer',
            'sexe' => 'required|string|in:M,F',
            'email' => 'required|email|max:255',
            // Ajoutez d'autres champs selon vos besoins
        ]);

        // À implémenter: enregistrer le patient dans la base de données
        $patient = $validated; // Simuler la création pour l'instant
        $patient['id'] = 1; // Simuler un ID
        
        return response()->json([
            'success' => true,
            'message' => 'Patient créé avec succès',
            'data' => $patient
        ], 201);
    }

    /**
     * Affiche les détails d'un patient spécifique.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        // À implémenter: récupérer le patient depuis la base de données
        $patient = [
            'id' => $id,
            'nom' => 'Exemple',
            'prenom' => 'Patient',
            'age' => 45,
            'sexe' => 'M',
            'email' => 'patient@exemple.com'
        ]; // Simuler des données pour l'instant
        
        return response()->json([
            'success' => true,
            'data' => $patient
        ]);
    }

    /**
     * Met à jour les informations d'un patient.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        // Validation des données
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer',
            'sexe' => 'sometimes|string|in:M,F',
            'email' => 'sometimes|email|max:255',
            // Ajoutez d'autres champs selon vos besoins
        ]);

        // À implémenter: mettre à jour le patient dans la base de données
        $patient = array_merge([
            'id' => $id,
            'nom' => 'Exemple',
            'prenom' => 'Patient',
            'age' => 45,
            'sexe' => 'M',
            'email' => 'patient@exemple.com'
        ], $validated); // Simuler la mise à jour pour l'instant
        
        return response()->json([
            'success' => true,
            'message' => 'Patient mis à jour avec succès',
            'data' => $patient
        ]);
    }

    /**
     * Supprime un patient.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        // À implémenter: supprimer le patient de la base de données
        
        return response()->json([
            'success' => true,
            'message' => 'Patient supprimé avec succès'
        ]);
    }
}
