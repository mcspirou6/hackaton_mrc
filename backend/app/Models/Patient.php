<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Patient extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'identifiant',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'address',
        'phone',
        'emergency_contact',
        'referring_doctor_id',
        'photo_url',
        'status',
        'ckd_stage',
        'derniere_visite',
        'prochaine_visite',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birth_date' => 'date',
        'derniere_visite' => 'date',
        'prochaine_visite' => 'date',
    ];



    /**
     * Get the referring doctor for this patient.
     */
    public function referringDoctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referring_doctor_id');
    }

    /**
     * Get the medical records for this patient.
     */
    public function patientRecords(): HasMany
    {
        return $this->hasMany(PatientRecord::class);
    }

    /**
     * Get the latest medical record for this patient.
     */
    public function latestRecord(): HasOne
    {
        return $this->hasOne(PatientRecord::class)->latest();
    }

    /**
     * Get the appointments for this patient.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the consultations for this patient.
     */
    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }

    /**
     * Get the full name of the patient.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
