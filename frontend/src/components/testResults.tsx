import React from "react";

interface TestResultsProps {
  date: string;
  test: string;
  resultat: string;
}

const TestResults: React.FC<TestResultsProps> = ({ date, test, resultat }) => {
  return (
    <div className="w-full md:w-80 bg-amber-200 m-2 p-4 rounded-lg shadow-xl flex flex-col">
      {/* Titre et date de l'historique médical */}
      <div className="mb-3">
        <p className="text-lg font-semibold text-gray-800">{date}</p>
      </div>

      {/* Section du test */}
      <div className="mb-3">
        <p className="font-medium text-gray-700">
          <strong>Test:</strong> {test}
        </p>
      </div>

      {/* Section du résultat */}
      <div className="mb-3">
        <p className="font-medium text-gray-700">
          <strong>Résultat:</strong> {resultat}
        </p>
      </div>
    </div>
  );
};

export default TestResults;
