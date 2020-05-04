<?php
/*
JSON_SQL_Bridge
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once __DIR__."/config.php"; $Oa=TABLESDIR."/".KIBELLADB; $lbs=FALSE; $lg=checkdirexistsorcreate(TABLESDIR,$O48=FALSE); if ($lg === FALSE) { showmessage("",TAG_ERROR,msgerrorinternaltablesdircouldnotcreate().msgnotecheckuserpermissions()); exit; } else { echo "<h2>Kibella reset process started</h2>"; if (file_exists($Oa)) { $lg=unlink($Oa); if (!$lg) { showmessage("\t\t",TAG_ERROR,"Could not delete database file '".$Oa."'.\nThe process aborts.\n"); exit; } } } $lg=l6n($O8f=NULL,$O48=TRUE); $lbs=!$lg; if ($lbs === FALSE) { $la="income"; $Oa="income.sqlite"; $lb="sqlite"; $Ob=""; $lc=""; $Oc=""; $ld=1; $l7r=array("table" => $la,"db" => $Oa,"dbprovider" => $lb,"datefields" => $Ob,"geofields" => $lc,"linkfields" => $Oc,"enablecache" => $ld); $Of=dbregistertable($l7r); $lbs=!$lg && !$Of["rc"]; } $lg=checkdirexistsorcreate(CACHEDIR,$O48=FALSE); if ($lg === FALSE) { $lbs=TRUE; } else { $lax=deletedir(CACHEDIR,$l4b=TRUE); if ($lax) echo msgnotesuccessfullydeleted("Cache files"); $lbs=!$lax; } if ($lbs === FALSE) { echo "<h4>System successfully reset</h4>"; } else { echo "<h4>ERRORS FOUND! Check messages shown above.</h4>"; }