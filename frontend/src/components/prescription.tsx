import React from "react";

interface PrescriptionProps {
  date: string;
  medicament: string;
  dosage: string;
}

export default function Prescription({ date, medicament, dosage }: PrescriptionProps) {
  return (
    <div className="w-full md:w-80 bg-amber-200 m-2 p-4 rounded-lg shadow-xl flex flex-col">
      {/* Titre et date de la prescription */}
      <div className="mb-3">
        <p className="text-lg font-semibold text-gray-800">{date}</p>
      </div>

      {/* Section du médicament */}
      <div className="mb-3">
        <p className="font-medium text-gray-700">
          <strong>Médicament:</strong> {medicament}
        </p>
      </div>

      {/* Section du dosage */}
      <div className="mb-3">
        <p className="font-medium text-gray-700">
          <strong>Dosage:</strong> {dosage}
        </p>
      </div>
    </div>
  );
}
