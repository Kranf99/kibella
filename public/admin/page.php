<?php
/*
 KIBELLA 1.0
 Copyright 2016 Frank Vanden berghen
 All Right reserved.

 Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License".
 If you are interested in distributing, reselling, modifying, contibuting or in general creating
 any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
 */
namespace kibella;

require_once(__DIR__ . '/../../JSON_SQL_Bridge/users/user.php');

$user = new User();

if($user->isAdmin()) {
  require_once(__DIR__ . '/../../JSON_SQL_Bridge/users/manager.php');

  $user_manager = new UserManager();

  include('base.php');
} else {
  echo 'You have to be an admin to access this page.';
}