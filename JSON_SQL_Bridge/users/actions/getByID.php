<?php
/*
 JSON_SQL_Bridge
 Copyright 2016 Frank Vanden berghen
 All Right reserved.

 JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License".
 If you are interested in distributing, reselling, modifying, contibuting or in general creating
 any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
 */
namespace kibella;

require_once __DIR__ . '/../manager.php';

$user_manager = new UserManager();

$user_datas = $user_manager->getUser($_GET["id"]);
unset($user_datas['password']);
echo json_encode($user_datas);