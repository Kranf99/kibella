<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once __DIR__."/config.php"; $O21=TABLESDIR."/".KIBELLADB; $Oaf=FALSE; $l29=checkdirexistsorcreate(TABLESDIR,$l2t=FALSE); if ($l29 === FALSE) { O29("",lc,l59().O59()); exit; } else { echo "<h2>Kibella reset process started</h2>"; if (file_exists($O21)) { $l29=unlink($O21); if (!$l29) { O29("\t\t",lc,"Could not delete database file '".$O21."'.\nThe process aborts.\n"); exit; } } } $l29=O5a($O77=NULL,$l2t=TRUE); $Oaf=!$l29; if ($Oaf === FALSE) { $l22="income"; $O21="income.sqlite"; $O24="sqlite"; $l25=""; $O25=""; $l26=""; $O26=1; $l27=array("table" => $l22,"db" => $O21,"dbtype" => $O24,"datefields" => $l25,"geofields" => $O25,"linkfields" => $l26,"enablecache" => $O26); $O27=l28($l27); $Oaf=!$l29 && !$O27["rc"]; } $l29=checkdirexistsorcreate(CACHEDIR,$l2t=FALSE); if ($l29 === FALSE) { $Oaf=TRUE; } else { $O9k=deletedir(CACHEDIR,$O2v=TRUE); if ($O9k) echo l6v("Cache files"); $Oaf=!$O9k; } if ($Oaf === FALSE) { echo "<h4>System successfully reset</h4>"; } else { echo "<h4>ERRORS FOUND! Check messages shown above.</h4>"; }