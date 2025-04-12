<p>Bonjour {{ $appointment->patient->last_name }},</p>
<p>Ce message est un rappel que vous avez un rendez-vous dans 15 minutes avec :</p>

<ul>
    <li>Medecin : {{ $appointment->doctor->first_name }} {{ $appointment->doctor->last_name }}</li>
    <li>Date : {{ $appointment->date }} à {{ $appointment->time }}</li>
    <li>Type : {{ $appointment->type }}</li>
    <li>Statut : {{ $appointment->status }}</li>
</ul>
