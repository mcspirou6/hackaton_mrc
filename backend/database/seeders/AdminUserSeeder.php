<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un administrateur par défaut
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Système',
            'email' => 'admin@mrc-app.com',
            'phone' => '+221 77 123 45 67',
            'password' => Hash::make('12345678'),
            'license_number' => null,
            'specialization' => null,
            'role' => 'admin',
            'status' => 'actif',
        ]);
        // Création d'un médecin
        User::create([
            'first_name' => 'Medecin',
            'last_name' => 'User',
            'email' => 'medecin@mrc-app.com',
            'phone' => '+221 77 133 45 67',
            'password' => Hash::make('password'),
            'license_number' => 'MED12345',
            'specialization' => 'Cardiologie',
            'role' => 'medecin',
            'status' => 'actif',
        ]);
    }
}
