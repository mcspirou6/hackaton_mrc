<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Affiche la liste des rapports.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $reports = Report::with(['patient', 'user'])->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Crée un nouveau rapport.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validation des données
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:Mensuel,Trimestriel,Annuel,Personnalisé',
            'category' => 'required|string|in:Patients,Traitements,Médicaments,Performance',
            'author' => 'required|string|max:100',
            'status' => 'required|string|in:Généré,En cours,Programmé',
            'format' => 'required|string|in:PDF,Excel,CSV',
            'patient_id' => 'required|exists:patients,id',
            'user_id' => 'required|exists:users,id',
            'content' => 'required|array',
        ]);

        // Ajouter la date actuelle
        $validated['date'] = Carbon::now()->format('d/m/Y');
        
        // Créer le rapport
        $report = Report::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Rapport créé avec succès',
            'data' => $report
        ], 201);
    }

    /**
     * Affiche les détails d'un rapport spécifique.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $report = Report::with(['patient', 'user'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $report
        ]);
    }

    /**
     * Récupère tous les rapports d'un patient spécifique.
     *
     * @param int $patientId
     * @return JsonResponse
     */
    public function getByPatient(int $patientId): JsonResponse
    {
        $patient = Patient::findOrFail($patientId);
        $reports = Report::where('patient_id', $patientId)
                        ->with('user')
                        ->orderBy('created_at', 'desc')
                        ->get();
        
        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Télécharge un rapport spécifique.
     *
     * @param int $id
     * @return JsonResponse|StreamedResponse
     */
    public function download(int $id)
    {
        $report = Report::findOrFail($id);
        
        // Vérifier si le rapport a un fichier associé
        if (!$report->file_path || !Storage::exists($report->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun fichier disponible pour ce rapport'
            ], 404);
        }
        
        return Storage::download($report->file_path, "rapport_{$report->id}.pdf");
    }

    /**
     * Supprime un rapport.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $report = Report::findOrFail($id);
        
        // Supprimer le fichier associé s'il existe
        if ($report->file_path && Storage::exists($report->file_path)) {
            Storage::delete($report->file_path);
        }
        
        $report->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Rapport supprimé avec succès'
        ]);
    }
}
