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
        Schema::create('kidney_disease_stages', function (Blueprint $table) {
            $table->id();
            $table->string('stage')->comment('G1, G2, G3a, G3b, G4, G5');
            $table->text('name');
            $table->text('description');
            $table->float('gfr_min')->comment('Débit de filtration glomérulaire minimum');
            $table->float('gfr_max')->comment('Débit de filtration glomérulaire maximum');
            $table->text('recommendations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kidney_disease_stages');
    }
};
