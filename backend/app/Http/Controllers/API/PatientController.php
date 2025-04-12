<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Visit;
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
        $patients = Patient::with('referringDoctor')->get();

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
        // 1. Valider les données
        $data = $request->validate([
            'identifiant' => 'required|unique:patients,identifiant',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'referring_doctor_id' => 'nullable|exists:users,id',
            'photo_url' => 'nullable|image|max:2048',
            'status' => 'required|in:stable,critique,attention',
            'ckd_stage' => 'nullable|in:Stade 1,Stade 2,Stade 3,Stade 4,Stade 5',
            'derniere_visite' => 'nullable|date',
            'prochaine_visite' => 'nullable|date',
        ]);

        // 2. Enregistrer le patient
        $patient = Patient::create($data);
        // 2. Gérer l'upload de la photo si elle est présente
        if ($request->hasFile('photo_url')) {
            // Stocker l'image dans le dossier 'photos' du stockage public
            $path = $request->file('photo_url')->store('photos', 'public');

            // Ajouter l'URL complète du fichier dans les données (utilise `Storage::url()` pour obtenir le lien absolu)
            $data['photo_url'] = Storage::url($path);
        }

        // 3. Rediriger ou retourner réponse JSON
        return response()->json(['success' => true, 'message' => 'Patient enregistré avec succès', 'patient' => $patient], 201);
    }


    /**
     * Affiche les détails d'un patient spécifique.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $patient = Patient::with('referringDoctor')->findOrFail($id);

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
        $patient = Patient::findOrFail($id);

        // Validation des données
        $validated = $request->validate([
            'identifiant' => 'sometimes|string|max:255|unique:patients,identifiant,' . $id,
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'birth_date' => 'sometimes|date',
            'gender' => 'sometimes|string|in:male,female',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'emergency_contact' => 'nullable|string|max:255',
            'referring_doctor_id' => 'nullable|exists:users,id',
            'photo_url' => 'nullable|string',
        ]);

        $patient->update($validated);

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
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Patient supprimé avec succès'
        ]);
    }

    public function getStatusOptions()
    {
        // Récupère les valeurs de l'énumération depuis la structure de la table
        return response()->json([
            ['value' => 'Stable', 'label' => 'Stable'],
            ['value' => 'Critique', 'label' => 'Critique'],
            ['value' => 'Attention', 'label' => 'Attention']
        ]);
    }

    public function getCKDStages()
    {
        // Valeurs exactes de votre colonne enum
        return response()->json([
            ['value' => 'Stade 1', 'label' => 'Stade 1'],
            ['value' => 'Stade 2', 'label' => 'Stade 2'],
            ['value' => 'Stade 3', 'label' => 'Stade 3'],
            ['value' => 'Stade 4', 'label' => 'Stade 4'],
            ['value' => 'Stade 5', 'label' => 'Stade 5']
        ]);
    }
}
