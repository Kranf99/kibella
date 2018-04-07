<?php

namespace kibella;

require_once(__DIR__ . '/../../../JSON_SQL_Bridge/users/user.php');

$user = new User();

if($user->isLoggedIn()) {
  header('Location: ../../..');
  die();
}

require_once(__DIR__ . '/../../../JSON_SQL_Bridge/users/session.php');

$session = new Session();

include('views/login.php');