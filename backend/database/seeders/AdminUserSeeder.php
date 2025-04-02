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
            'role' => 'admin',
            'status' => 'actif',
        ]);
    }
}
