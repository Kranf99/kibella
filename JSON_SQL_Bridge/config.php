<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; error_reporting( E_ALL); const O6=01123240; ini_set("session.gc_maxlifetime",O6); ini_set("session.gc_probability",1); ini_set("session.gc_divisor",1); ini_set("session.cookie_lifetime",O6); session_set_cookie_params(O6); ini_set("time_limit",0454); if ( isset ($_COOKIE[session_name()])) setcookie(session_name(),$_COOKIE[session_name()],time()+O6,"/"); require_once "configreadinifile.php"; require_once "functionsaux.php"; require_once "constants.php"; require_once "geohash.php"; require_once "globals.php"; require_once "functionsauxkibella.php"; require_once "functionsdashaccelerate.php"; require_once "functionsdb.php"; require_once "functionsparse.php"; require_once "functionsmsg.php"; require_once "functionsquery.php"; require_once "functionsserver.php"; require_once "functionsstatic.php"; require_once "classes.php";