<?php
/*
JSON_SQL_Bridge 1.1
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once __DIR__."/config.php"; $l1w=TABLESDIR."/".KIBELLADB; $la2=FALSE; $l2f=l2c(TABLESDIR,$l2e=FALSE); if ($l2f === FALSE) { O2f("",l6,l4y().O4y()); exit; } else { echo "<h2>Kibella reset process started</h2>"; if (file_exists($l1w)) { $l2f=unlink($l1w); if (!$l2f) { O2f("\t\t",l6,"Could not delete database file '".$l1w."'.\nThe process aborts.\n"); exit; } } } $l2f=O4z($O71=NULL,$l2e=TRUE); $la2=!$l2f; if ($la2 === FALSE) { $O1w="income"; $l1w="income.sqlite"; $O4l="sqlite"; $O5b=""; $l5c=""; $O63=""; $O6j=1; $l63=array("table" => $O1w,"db" => $l1w,"dbtype" => $O4l,"datefields" => $O5b,"geofields" => $l5c,"linkfields" => $O63,"enablecache" => $O6j); $O51=l6i($l63); $la2=!$l2f && !$O51["rc"]; } $l2f=l2c(CACHEDIR,$l2e=FALSE); if ($l2f === FALSE) { $la2=TRUE; } else { $l98=l2i(CACHEDIR,$O2i=TRUE); if ($l98) echo O6m("Cache files"); $la2=!$l98; } if ($la2 === FALSE) { echo "<h4>System successfully reset</h4>"; } else { echo "<h4>ERRORS FOUND! Check messages shown above.</h4>"; }