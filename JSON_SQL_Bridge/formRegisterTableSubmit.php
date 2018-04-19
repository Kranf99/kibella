<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once "config.php"; $l22=$_POST["table"]; $O21=$_POST["db"]; $O24="sqlite"; $l25=$_POST["datefields"]; $O25=$_POST["geofields"]; $l26=$_POST["linkfields"]; $O26=$_POST["enablecache"]; $l27=array("table" => $l22,"db" => $O21,"dbtype" => $O24,"datefields" => $l25,"geofields" => $O25,"linkfields" => $l26,"enablecache" => $O26); $O27=l28($l27); if ($O27 !== FALSE) { $O28=$O27["id"]; $l29=$O27["rc"]; if ($l29 === FALSE) { O29( __FILE__ ,Oc,l2a()); } else { switch ($l29) { case (lf): O29("",lb,O2a($l22,$O21,$O28,$O26)); break; case (Of): O29("",lb,l2b($l22,$O21,$O28,$O26)); break; case (le): O29("",lc,O2b(DATADIR."/".$O21)); break; case (Oe): O29("",lc,l2c($l22,DATADIR."/".$O21)); break; default : O29( __FILE__ ,Oc,O2c($l29)); break; } } if ($l25 !== "" or $O25 !== "" or $l26 !== "") { echo "<h4>The following fields were registered as fields of special type:</h4>"; $l2d=O2d($O28); if ($l2d == NULL || count($l2d) == 0) { echo "<em>No fields were registered as fields of special type.</em>"; } else { foreach ($l2d as $l2e => $O2e) { if ($O2e === "date" || $O2e === "geo_point" || $O2e === "url") { echo "$O2e: $l2e<br>"; } } } } } echo "<pre><button type=\"button\" onclick=\"history.go(-1);\">Go back to previous page</button></pre>";