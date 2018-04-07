<!--
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
-->
<h1>Manage users</h1>

<table class="table table-striped">
  <thead>
    <tr>
      <th class="id">ID</th>
      <th>First name</th>
      <th>Last name</th>
      <th>Email</th>
      <th>Admin</th>
      <th class="action"> </th>
      <th class="action"> </th>
    </tr>
  </thead>
  <tbody>
    <?php
      foreach($user_manager->getAll() as $user) {
        echo '<tr><td>' . $user['id'] . '</td><td>' . $user['firstname'] . '</td><td>' . $user['lastname'] . '</td><td>' . $user['email'] . '</td><td>' . $user['is_admin'] . '</td><td><a href="edit.php?id=' . $user['id'] . '"><i class="fa fa-pencil"></i></a></td><td><form action="manage.php" method="post"><button type="submit" onclick="return confirm(\'Do you REALLY want to remove the account of ' . $user['email'] . ' ?\nThis action is permanent.\')" name="delete" value="' . $user['email'] . '"><i class="fa fa-close"></i></button></form></td></tr>';
      }
    ?>
  </tbody>
</table>