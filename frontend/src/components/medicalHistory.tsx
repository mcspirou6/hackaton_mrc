import React from "react";

interface MedicalHistoryProps {
    index: number;
    date: string;
    diagnosis: string;
    treatment: string;
}

export default function MedicalHistory({ index, date, diagnosis, treatment }: MedicalHistoryProps) {
    return (
        <div className="w-full md:w-80 bg-amber-200 m-2 p-4 rounded-lg shadow-xl flex flex-col">
            {/* Titre et date de l'historique médical */}
            <div className="mb-3">
                <p className="text-lg font-semibold text-gray-800">{date}</p>
            </div>

            {/* Section du diagnostic */}
            <div className="mb-3">
                <p className="font-medium text-gray-700">
                    <strong>Diagnostic:</strong> {diagnosis}
                </p>
            </div>

            {/* Section du traitement */}
            <div className="mb-3">
                <p className="font-medium text-gray-700">
                    <strong>Traitement:</strong> {treatment}
                </p>
            </div>
        </div>
    );
}
