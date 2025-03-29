import React from "react";
import { Trash2 } from "lucide-react";

interface PatientListProps {
  id: number;
  name: string;
  age: number;
  stade: "Grave" | "Modéré" | "Léger";
  onClick: () => void;
}

export default function PatientList({ id, name, age, stade, onClick }: PatientListProps) {
  // Déterminer la couleur en fonction du stade
  const stadeColor =
    stade === "Grave"
      ? "text-red-500"
      : stade === "Modéré"
      ? "text-orange-500"
      : "text-green-500";

  return (
    <div>
      <li key={id} className="flex items-center justify-between border-b pb-2">
        <div>
          <span className="text-lg font-medium">{name}</span>
          <span className="text-gray-500 text-sm ml-2">{age} ans</span>
          <span className={`text-sm font-semibold ml-2 ${stadeColor}`}>{stade}</span>
        </div>
        <button onClick={onClick} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-5 h-5" />
        </button>
      </li>
    </div>
  );
}
