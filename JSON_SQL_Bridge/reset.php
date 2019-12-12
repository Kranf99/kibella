<?php
/*
JSON_SQL_Bridge 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once __DIR__."/config.php"; $l30=TABLESDIR."/".KIBELLADB; $Obm=FALSE; $O3s=checkdirexistsorcreate(TABLESDIR,$O3r=FALSE); if ($O3s === FALSE) { showmessage("",TAG_ERROR,l69().O69()); exit; } else { echo "<h2>Kibella reset process started</h2>"; if (file_exists($l30)) { $O3s=unlink($l30); if (!$O3s) { showmessage("\t\t",TAG_ERROR,"Could not delete database file '".$l30."'.\nThe process aborts.\n"); exit; } } } $O3s=l6a($O89=NULL,$O3r=TRUE); $Obm=!$O3s; if ($Obm === FALSE) { $O30="income"; $l30="income.sqlite"; $lp=O18; $l6p=""; $O6p=""; $O7h=""; $O7v=1; $l7h=array("table" => $O30,"db" => $l30,"dbengine" => $lp,"datefields" => $l6p,"geofields" => $O6p,"linkfields" => $O7h,"enablecache" => $O7v); $l67=dbregistertable($l7h); $Obm=!$O3s && !$l67["rc"]; } $O3s=checkdirexistsorcreate(CACHEDIR,$O3r=FALSE); if ($O3s === FALSE) { $Obm=TRUE; } else { $Oar=deletedir(CACHEDIR,$l3v=TRUE); if ($Oar) echo l6l("Cache files"); $Obm=!$Oar; } if ($Obm === FALSE) { echo "<h4>System successfully reset</h4>"; } else { echo "<h4>ERRORS FOUND! Check messages shown above.</h4>"; }