<?php

namespace kibella;

require_once(__DIR__ . '/../../../src/users/user.php');

$user = new User();

if($user->isLoggedIn()) {
  header('Location: ../../..');
  die();
}

require_once(__DIR__ . '/../../../src/users/session.php');

$session = new Session();

include('views/login.php');