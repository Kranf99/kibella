<?php
/*
 JSON_SQL_Bridge 1.0
 Copyright 2016 Frank Vanden berghen
 All Right reserved.

 JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License".
 If you are interested in distributing, reselling, modifying, contibuting or in general creating
 any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
 */
namespace kibella; require_once ( __DIR__."/../dashboard.php"); $O7=json_decode(file_get_contents("php://input"),TRUE); $l8=new l0(); $l5=$l8->l6($O7["id"],$O7["sharedValue"]); echo $l5;