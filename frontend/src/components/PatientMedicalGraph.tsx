import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { User2 } from 'lucide-react';

interface MedicalData {
  creatinine_level?: number | null;
  gfr?: number | null;
  albuminuria?: number | null;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  potassium_level?: number | null;
  hemoglobin_level?: number | null;
}

interface Props {
  medicalInfo: MedicalData;
}

const PatientMedicalGraph: React.FC<Props> = ({ medicalInfo }) => {
  // Transformer les données pour le graphe en barres
  const barData = [
    {
      name: 'Créatinine',
      value: medicalInfo.creatinine_level || 0,
      reference: '70-120 µmol/L'
    },
    {
      name: 'DFG',
      value: medicalInfo.gfr || 0,
      reference: '> 90 mL/min'
    },
    {
      name: 'Albuminurie',
      value: medicalInfo.albuminuria || 0,
      reference: '< 30 mg/24h'
    },
    {
      name: 'Potassium',
      value: medicalInfo.potassium_level || 0,
      reference: '3.5-5.0 mmol/L'
    },
    {
      name: 'Hémoglobine',
      value: medicalInfo.hemoglobin_level || 0,
      reference: '13-17 g/dL'
    }
  ];

  // Données pour la tension artérielle
  const bpData = [
    {
      name: 'Tension',
      systolic: medicalInfo.blood_pressure_systolic || 0,
      diastolic: medicalInfo.blood_pressure_diastolic || 0
    }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="w-full md:w-2/3">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Paramètres biologiques</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">{label}</p>
                        <p>Valeur: {payload[0].value}</p>
                        <p className="text-sm text-gray-600">
                          Référence: {barData.find(d => d.name === label)?.reference}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Anatomie</h3>
          <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-inner">
            <div className="relative">
              <User2 size={120} className="text-indigo-600" />
              <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Les points rouges indiquent la position des reins
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold mb-2 text-gray-800">Tension artérielle</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 200]} />
                <Tooltip />
                <Bar dataKey="systolic" name="Systolique" fill="#ef4444" />
                <Bar dataKey="diastolic" name="Diastolique" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalGraph;
