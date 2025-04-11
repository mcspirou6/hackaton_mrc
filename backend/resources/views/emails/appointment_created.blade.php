<h2>Bonjour Dr {{ $appointment->doctor->last_name }},</h2>

<p>Un nouveau rendez-vous est prévu :</p>
<ul>
    <li>Patient : {{ $appointment->patient->first_name }} {{ $appointment->patient->last_name }}</li>
    <li>Date : {{ $appointment->date }} à {{ $appointment->time }}</li>
    <li>Type : {{ $appointment->type }}</li>
</ul>

<p>Merci de consulter la plateforme pour plus de détails.</p>
