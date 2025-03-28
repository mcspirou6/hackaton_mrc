<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnalyzeController extends Controller
{
    /**
     * Analyse les données pour détecter la maladie rénale chronique.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function analyze(Request $request): JsonResponse
    {
        // Validation des données
        $validated = $request->validate([
            'age' => 'required|numeric',
            'blood_pressure' => 'required|numeric',
            'specific_gravity' => 'required|numeric',
            'albumin' => 'required|numeric',
            'sugar' => 'required|numeric',
            'red_blood_cells' => 'required|string',
            'pus_cell' => 'required|string',
            'pus_cell_clumps' => 'required|string',
            'bacteria' => 'required|string',
            'blood_glucose_random' => 'required|numeric',
            'blood_urea' => 'required|numeric',
            'serum_creatinine' => 'required|numeric',
            'sodium' => 'required|numeric',
            'potassium' => 'required|numeric',
            'hemoglobin' => 'required|numeric',
            'packed_cell_volume' => 'required|numeric',
            'white_blood_cell_count' => 'required|numeric',
            'red_blood_cell_count' => 'required|numeric',
            'hypertension' => 'required|string',
            'diabetes_mellitus' => 'required|string',
            'coronary_artery_disease' => 'required|string',
            'appetite' => 'required|string',
            'pedal_edema' => 'required|string',
            'anemia' => 'required|string',
        ]);

        // Ici, vous implémenteriez votre modèle de prédiction
        // Pour l'instant, nous simulons une prédiction
        $prediction = $this->simulatePrediction($validated);
        
        return response()->json([
            'success' => true,
            'prediction' => $prediction,
            'probability' => $prediction['probability'],
            'risk_factors' => $prediction['risk_factors'],
            'recommendations' => $prediction['recommendations']
        ]);
    }

    /**
     * Simule une prédiction de maladie rénale chronique.
     * À remplacer par un vrai modèle de prédiction.
     *
     * @param array $data
     * @return array
     */
    private function simulatePrediction(array $data): array
    {
        // Simuler une prédiction basée sur quelques facteurs de risque connus
        $riskScore = 0;
        
        // Facteurs de risque basés sur la littérature médicale
        if ($data['age'] > 60) $riskScore += 2;
        if ($data['hypertension'] === 'yes') $riskScore += 3;
        if ($data['diabetes_mellitus'] === 'yes') $riskScore += 3;
        if ($data['serum_creatinine'] > 1.2) $riskScore += 4;
        if ($data['blood_urea'] > 40) $riskScore += 3;
        if ($data['hemoglobin'] < 12) $riskScore += 2;
        
        // Calculer la probabilité basée sur le score de risque
        $probability = min(95, $riskScore * 5); // Max 95%
        
        // Déterminer les facteurs de risque principaux
        $riskFactors = [];
        if ($data['age'] > 60) $riskFactors[] = 'Âge avancé';
        if ($data['hypertension'] === 'yes') $riskFactors[] = 'Hypertension';
        if ($data['diabetes_mellitus'] === 'yes') $riskFactors[] = 'Diabète';
        if ($data['serum_creatinine'] > 1.2) $riskFactors[] = 'Créatinine sérique élevée';
        if ($data['blood_urea'] > 40) $riskFactors[] = 'Urée sanguine élevée';
        if ($data['hemoglobin'] < 12) $riskFactors[] = 'Anémie';
        
        // Recommandations basées sur les facteurs de risque
        $recommendations = [
            'Consultez un néphrologue pour une évaluation complète',
            'Surveillez régulièrement votre fonction rénale',
        ];
        
        if ($data['hypertension'] === 'yes') {
            $recommendations[] = 'Contrôlez votre pression artérielle';
        }
        
        if ($data['diabetes_mellitus'] === 'yes') {
            $recommendations[] = 'Maintenez un contrôle glycémique optimal';
        }
        
        // Résultat de la prédiction
        return [
            'has_disease' => $probability > 50,
            'probability' => $probability,
            'risk_level' => $this->getRiskLevel($probability),
            'risk_factors' => $riskFactors,
            'recommendations' => $recommendations
        ];
    }
    
    /**
     * Détermine le niveau de risque basé sur la probabilité.
     *
     * @param float $probability
     * @return string
     */
    private function getRiskLevel(float $probability): string
    {
        if ($probability < 30) {
            return 'Faible';
        } elseif ($probability < 60) {
            return 'Modéré';
        } else {
            return 'Élevé';
        }
    }
}
