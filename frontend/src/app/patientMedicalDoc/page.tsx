"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import MedicalHistory from "@/components/medicalHistory";
import Prescription from "@/components/prescription";
import TestResults from "@/components/testResults";

interface MedicalRecord {
  id: number;
  date: string;
  diagnosis: string;
  treatment: string;
}

interface PrescriptionRecord {
  date: string;
  medicine: string;
  dosage: string;
}

interface TestResult {
  test: string;
  date: string;
  result: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  stade: string;
  avatar: string;
  medicalHistory: MedicalRecord[];
  prescriptions: PrescriptionRecord[];
  testResults: TestResult[];
}

export default function PatientMedicalDoc() {
  // Exemple de données pour le patient
  const patient: Patient = {
    id: 1,
    name: "Jean Dupont",
    age: 45,
    stade: "Modéré",
    avatar: "", // Ajoutez l'URL de l'image du patient ici
    medicalHistory: [
      {
        id: 1,
        date: "2025-02-10",
        diagnosis: "Grippe",
        treatment: "Paracétamol 500mg",
      },
      {
        id: 2,
        date: "2024-11-05",
        diagnosis: "Fracture du bras",
        treatment: "Plâtre et suivi",
      },
    ],
    prescriptions: [
      {
        date: "2025-02-10",
        medicine: "Paracétamol 500mg",
        dosage: "2 comprimés par jour",
      },
    ],
    testResults: [
      {
        test: "Radiographie du bras",
        date: "2024-11-10",
        result: "Fracture détectée",
      },
    ],
  };

  return (
    <div className="flex overflow-hidden">
      <Sidebar />
      <div className="ml-[300px] pl-6 pt-13 overflow-y-auto h-screen w-full flex flex-col">
        <div>
          {/* Section de l'en-tête avec les informations du patient */}
          <div className="flex items-center mb-8">
            <div className="w-40 h-40 border-2 rounded-full">
              <img src={patient.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="ml-10 flex flex-col">
              <span className="text-2xl font-bold">{patient.name}</span>
              <span className="text-lg text-gray-500">Âge: {patient.age} ans</span>
              <span
                className={`text-sm font-semibold ${
                  patient.stade === "Grave"
                    ? "text-red-500"
                    : patient.stade === "Modéré"
                    ? "text-orange-500"
                    : "text-green-500"
                }`}
              >
                Stade: {patient.stade}
              </span>
            </div>
          </div>
          <hr className="mt-8 mb-6" />

          {/* Section du dossier médical avec scroll */}
          <div className="space-y-6 max-h-[600px]">
            {/* Historique médical */}
            <div className="card p-4 shadow-md rounded-lg w-full">
              <div className="flex">
                <h2 className="text-xl font-semibold mb-4 mr-6">Historique Médical</h2>
                <button className="border-2 rounded-lg px-2">Ajouter une nouvelle historique Medical</button>
              </div>
              <div className="flex overflow-x-auto">
                <ul className="space-y-4 flex overflow-x-auto">
                  {patient.medicalHistory.map((record) => (
                    <MedicalHistory key={record.id} index={record.id} date={record.date} diagnosis={record.diagnosis} treatment={record.treatment} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="card p-4 shadow-md rounded-lg w-full">
              <div className="flex">
                <h2 className="text-xl font-semibold mb-4 mr-6">Prescriptions</h2>
                <button className="border-2 rounded-lg px-2">Ajouter une nouvelle prescription</button>
              </div>
              <div className="flex overflow-x-auto">
                <ul className="space-y-4 flex overflow-x-auto">
                  {patient.prescriptions.map((prescription, index) => (
                    <Prescription key={index} date={prescription.date} medicament={prescription.medicine} dosage={prescription.dosage} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Résultats des tests */}
            <div className="card p-4 shadow-md rounded-lg w-full">
              <div className="flex">
                <h2 className="text-xl font-semibold mb-4 mr-6">Résultats des Tests</h2>
                <button className="border-2 rounded-lg px-2">Ajouter un nouveau Résultats des Tests</button>
              </div>
              <div className="flex overflow-x-auto">
                <ul className="space-y-4 flex overflow-x-auto">
                  {patient.testResults.map((test, index) => (
                    <TestResults key={index} date={test.date} test={test.test} resultat={test.result} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
