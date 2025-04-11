<h2>Bonjour Dr <?php echo e($appointment->doctor->last_name); ?>,</h2>

<p>Un nouveau rendez-vous est prévu :</p>
<ul>
    <li>Patient : <?php echo e($appointment->patient->first_name); ?> <?php echo e($appointment->patient->last_name); ?></li>
    <li>Date : <?php echo e($appointment->date); ?> à <?php echo e($appointment->time); ?></li>
    <li>Type : <?php echo e($appointment->type); ?></li>
    <li>Statut : <?php echo e($appointment->status); ?></li>
</ul>

<p>Merci de consulter la plateforme pour plus de détails.</p>
<?php /**PATH E:\xampp\htdocs\Projet Personnel\IFRI\HACKATON\finale\hackaton_mrc\backend\resources\views/emails/appointment_created.blade.php ENDPATH**/ ?>