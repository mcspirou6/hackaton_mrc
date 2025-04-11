<h2>Bonjour <?php echo e($appointment->patient->last_name); ?>,</h2>

<p>Un nouveau rendez-vous est prévu :</p>
<ul>
    <li>Date : <?php echo e($appointment->date); ?> à <?php echo e($appointment->time); ?></li>
    <li>Type : <?php echo e($appointment->type); ?></li>
</ul>

<?php /**PATH E:\xampp\htdocs\Projet Personnel\IFRI\HACKATON\finale\hackaton_mrc\backend\resources\views/emails/appointment_patient.blade.php ENDPATH**/ ?>