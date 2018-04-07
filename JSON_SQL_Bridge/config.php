<?php
/*
JSON_SQL_Bridge 1.1
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; error_reporting( E_ALL); const l0=01123240; ini_set("session.gc_maxlifetime",l0); ini_set("session.gc_probability",1); ini_set("session.gc_divisor",1); ini_set("session.cookie_lifetime",l0); session_set_cookie_params(l0); ini_set("time_limit",0454); if ( isset ($_COOKIE[session_name()])) setcookie(session_name(),$_COOKIE[session_name()],time()+l0,"/"); require_once "configreadinifile.php"; require_once "functionsaux.php"; require_once "constants.php"; require_once "geohash.php"; require_once "globals.php"; require_once "functionsauxkibella.php"; require_once "functionsdashaccelerate.php"; require_once "functionsdb.php"; require_once "functionsparse.php"; require_once "functionsmsg.php"; require_once "functionsquery.php"; require_once "functionsserver.php"; require_once "functionsstatic.php"; require_once "SQLite3Ext.php";