<?php
/*
KIBELLA 2.5
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/

namespace kibella;

// Check user authentication
require_once 'JSON_SQL_Bridge/users/user.php';

$user = new User();

if(!$user->isLoggedIn()) {
  header('Location: public/users/login');
} else {
  header('Location: ' . $_SERVER['REQUEST_URI'] . '/interface');
}

die();

?>