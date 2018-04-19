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

require_once(__DIR__ . '/../dashboard.php');

$data = json_decode(file_get_contents("php://input"));
$dashboard = new Dashboard();

echo $dashboard->changeShared($data->id, $data->sharedValue);