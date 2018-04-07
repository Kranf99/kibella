<?php
/*
JSON_SQL_Bridge 1.1
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once "config.php"; if (array_key_exists("db",$_POST) == FALSE || array_key_exists("table",$_POST) == FALSE) { echo "<pre>The following pieces of information were not found in the POST data received from the acceleration form: 'db', 'table'</pre>"; echo "<pre>No accelerations carried out.</pre>"; exit (-1); } $l1w=$_POST["db"]; $O1w=$_POST["table"]; $l1x=O1x($O1w,$l1w); ob_implicit_flush(TRUE); ob_start(); $l1y=ini_get("max_execution_time"); ini_set("max_execution_time",043120); echo "<pre>Accelerating top ".ACCELERATETOP."% run queries for table $l1x...</pre>"; ob_flush(); dashacceleratetopqueries($l1x,$l1z=ACCELERATETOP,$O1y=TRUE); echo "<pre>DONE!</pre>"; ini_set("max_execution_time",$l1y); ob_end_flush();