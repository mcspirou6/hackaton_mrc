<h2>Bonjour {{ $appointment->patient->last_name }},</h2>

<p>Un nouveau rendez-vous est prévu :</p>
<ul>
    <li>Date : {{ $appointment->date }} à {{ $appointment->time }}</li>
    <li>Type : {{ $appointment->type }}</li>
    <li>Statut : {{ $appointment->status }}</li>
</ul>

