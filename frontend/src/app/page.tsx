"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/api/api";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

   try {
      const response = await login({ email, password });
      
      // Traiter la réponse comme any pour éviter les erreurs de typage
      const apiResponse = response as any;
      
      if (apiResponse.success) {
        // Rediriger en fonction du rôle de l'utilisateur
        if (apiResponse.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(apiResponse.message || "Échec de la connexion");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-cyan-500 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-700">NéphroSuivi</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-500 hover:text-cyan-500">Accueil</a>
          <a href="#" className="text-gray-500 hover:text-cyan-500">Médecins</a>
          <a href="#" className="text-gray-500 hover:text-cyan-500">Diagnostics</a>
          <a href="#" className="text-gray-500 hover:text-cyan-500">Contact</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center p-8 md:p-16">
        {/* Left content */}
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-700 mb-6">Suivi des Maladies Rénales Chroniques</h1>
          <p className="text-lg text-gray-600 mb-8">
            Plateforme spécialisée pour les professionnels de santé dédiée au suivi et à la gestion des patients atteints de maladies rénales chroniques.
          </p>
          <div className="mt-8">
            <button 
              onClick={() => document.getElementById('email')?.focus()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 inline-flex items-center"
            >
              Commencer
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right content - Login form */}
        <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace médical</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="docteur@exemple.fr"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
                  Mot de passe oublié?
                </a>
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Utilisez l'email <span className="font-semibold">admin@mrc-app.com</span> et le mot de passe <span className="font-semibold">12345678</span> pour vous connecter en tant qu'administrateur.
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Kidney illustration */}
      <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20C120 20 140 40 140 60C140 80 120 100 100 100C80 100 60 80 60 60C60 40 80 20 100 20Z" fill="#FF7F7F"/>
          <path d="M100 100C120 100 140 120 140 140C140 160 120 180 100 180C80 180 60 160 60 140C60 120 80 100 100 100Z" fill="#FF7F7F"/>
        </svg>
      </div>
    </div>
  );
}
