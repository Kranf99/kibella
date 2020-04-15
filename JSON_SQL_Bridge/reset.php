<?php
/*
JSON_SQL_Bridge 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once __DIR__."/config.php"; $O30=TABLESDIR."/".KIBELLADB; $lbq=FALSE; $l3t=checkdirexistsorcreate(TABLESDIR,$l3s=FALSE); if ($l3t === FALSE) { showmessage("",TAG_ERROR,l6c().O6c()); exit; } else { echo "<h2>Kibella reset process started</h2>"; if (file_exists($O30)) { $l3t=unlink($O30); if (!$l3t) { showmessage("\t\t",TAG_ERROR,"Could not delete database file '".$O30."'.\nThe process aborts.\n"); exit; } } } $l3t=l6d($l8d=NULL,$l3s=TRUE); $lbq=!$l3t; if ($lbq === FALSE) { $l31="income"; $O30="income.sqlite"; $lp=l19; $O6s=""; $l6t=""; $l7l=""; $l7z=1; $O7k=array("table" => $l31,"db" => $O30,"dbengine" => $lp,"datefields" => $O6s,"geofields" => $l6t,"linkfields" => $l7l,"enablecache" => $l7z); $l6a=dbregistertable($O7k); $lbq=!$l3t && !$l6a["rc"]; } $l3t=checkdirexistsorcreate(CACHEDIR,$l3s=FALSE); if ($l3t === FALSE) { $lbq=TRUE; } else { $lav=deletedir(CACHEDIR,$O3v=TRUE); if ($lav) echo O6o("Cache files"); $lbq=!$lav; } if ($lbq === FALSE) { echo "<h4>System successfully reset</h4>"; } else { echo "<h4>ERRORS FOUND! Check messages shown above.</h4>"; }