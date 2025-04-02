<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\AnalyzeController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AppointmentController;
use App\Http\Controllers\API\ConsultationController;
use App\Http\Controllers\API\PatientRecordController;
use App\Http\Controllers\API\KidneyDiseaseStageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes d'authentification
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Utilisateur authentifié
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Routes pour les médecins
    Route::apiResource('users', UserController::class);
    Route::get('/doctors', [UserController::class, 'index']);
    Route::get('/doctors/statistics', [UserController::class, 'statistics']);
    Route::post('/users/{id}/reset-password', [AuthController::class, 'resetPassword']);
    
    // Routes pour les patients
    Route::apiResource('patients', PatientController::class);
    
    // Routes pour les rendez-vous
    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/appointments/statistics', [AppointmentController::class, 'statistics']);
    
    // Routes pour les consultations
    Route::apiResource('consultations', ConsultationController::class);
    Route::get('/consultations/statistics', [ConsultationController::class, 'statistics']);
    Route::get('/patients/{patientId}/consultations', [ConsultationController::class, 'getPatientHistory']);
    
    // Routes pour les dossiers médicaux
    Route::apiResource('patient-records', PatientRecordController::class);
    Route::get('/patient-records/statistics', [PatientRecordController::class, 'statistics']);
    Route::get('/patients/{patientId}/latest-record', [PatientRecordController::class, 'getLatestForPatient']);
    
    // Routes pour les stades de maladie rénale
    Route::apiResource('kidney-disease-stages', KidneyDiseaseStageController::class);
    Route::post('/determine-stage', [KidneyDiseaseStageController::class, 'determineStageByGFR']);
});

// Route pour l'analyse de maladie rénale (accessible sans authentification pour les tests)
Route::post('/analyze', [AnalyzeController::class, 'analyze']);
