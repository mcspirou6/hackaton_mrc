<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Renommer le champ 'name' en 'first_name'
            $table->renameColumn('name', 'first_name');
            
            // Ajouter les nouveaux champs
            $table->string('last_name')->after('first_name');
            $table->string('phone')->nullable()->after('email');
            $table->string('license_number')->nullable()->after('password')->comment('Numéro de licence médicale');
            $table->string('specialization')->nullable()->after('license_number')->comment('Néphrologie, médecine générale, etc.');
            $table->enum('role', ['medecin', 'admin'])->default('medecin')->after('specialization');
            $table->enum('status', ['actif', 'suspendu', 'desactive'])->default('actif')->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer les nouveaux champs
            $table->dropColumn([
                'last_name',
                'phone',
                'license_number',
                'specialization',
                'role',
                'status'
            ]);
            
            // Renommer 'first_name' en 'name'
            $table->renameColumn('first_name', 'name');
        });
    }
};
