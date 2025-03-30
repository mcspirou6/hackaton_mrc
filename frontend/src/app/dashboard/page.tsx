"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { SearchIcon } from "lucide-react";
import PatientList from "@/components/patientList";

// Définition du type pour un patient
interface Patient {
  id: number;
  name: string;
  age: number;
  stade: "Léger" | "Modéré" | "Grave";
}

export default function Dashboard() {
  // État pour stocker la liste des patients
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "Jean Dupont", age: 45, stade: "Modéré" },
    { id: 2, name: "Marie Curie", age: 38, stade: "Léger" },
  ]);

  // Fonction pour ajouter un nouveau patient à la liste
  const addPatient = () => {
    const newPatient: Patient = {
      id: patients.length + 1, // ID unique basé sur la longueur du tableau
      name: "Nouveau Patient",
      age: Math.floor(Math.random() * 60) + 20, // Génère un âge aléatoire entre 20 et 80
      stade: ["Léger", "Modéré", "Grave"][Math.floor(Math.random() * 3)] as "Léger" | "Modéré" | "Grave", // Sélectionne un stade aléatoire
    };
    setPatients([...patients, newPatient]); // Ajoute le patient à la fin de la liste
  };

  // Fonction pour supprimer un patient
  const removePatient = (id: number) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-[300px] pl-6 pt-13 w-full">
        <div className="flex">
          <div className="w-40 h-40 border-2 rounded-lg">
            <img src="#" alt="Profil" />
          </div>
          <div className="ml-10 pt-3 flex flex-col">
            <span>{"user.first_name user.last_name"}</span>
            <span>{"user.specialization"}</span>
            <span>{"user.licence_number"}</span>
            <span>{"user.email"}</span>
            <span>{"user.phone"}</span>
          </div>
        </div>
        <hr className="mt-8 mr-12" />
        <div className="mt-6">
          <span className="text-2xl font-bold">Mes Patients</span>
          <div className="flex">
            <div className="flex mt-4 text-center border-2 rounded-lg h-10 w-[70%]">
              <input
                type="search"
                placeholder="Rechercher un patient..."
                className="w-[92%] px-2"
              />
              <SearchIcon className="mt-1.5" />
            </div>
            <button
              onClick={addPatient}
              className="bg-green-500 rounded-lg border-2 font-bold border-black ml-8 px-3 text-white"
            >
              Nouveau patient
            </button>
          </div>
          <div>
            <ul>
              {patients.map((patient) => (
                <PatientList
                  key={patient.id}
                  id={patient.id}
                  name={patient.name}
                  age={patient.age}
                  stade={patient.stade}
                  onClick={() => removePatient(patient.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
