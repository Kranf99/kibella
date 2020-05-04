<?php
/*
JSON_SQL_Bridge
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; error_reporting( E_ALL); const O1l=01123240; ini_set("session.gc_maxlifetime",O1l); ini_set("session.gc_probability",1); ini_set("session.gc_divisor",1); ini_set("session.cookie_lifetime",O1l); session_set_cookie_params(O1l); ini_set("date.timezone","UTC"); if ( isset ($_COOKIE[session_name()])) setcookie(session_name(),$_COOKIE[session_name()],time()+O1l,"/"); require_once __DIR__."/configreadinifile.php"; require_once __DIR__."/configdbconnections.php"; require_once __DIR__."/functionsaux.php"; require_once __DIR__."/constants.php"; require_once __DIR__."/geohash.php"; require_once __DIR__."/globals.php"; require_once __DIR__."/functionsauxkibella.php"; require_once __DIR__."/functionsdashaccelerate.php"; require_once __DIR__."/functionsdb.php"; require_once __DIR__."/functionsparse.php"; require_once __DIR__."/functionsmsg.php"; require_once __DIR__."/functionsquery.php"; require_once __DIR__."/functionsserver.php"; require_once __DIR__."/functionsstatic.php"; require_once __DIR__."/classes.php"; require_once __DIR__."/users/user.php"; ini_set("max_execution_time",l1m);