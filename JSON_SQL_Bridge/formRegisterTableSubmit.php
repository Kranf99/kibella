<?php
/*
JSON_SQL_Bridge
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once __DIR__."/config.php"; $la=$_POST["table"]; $Oa=$_POST["db"]; $lb="sqlite"; $Ob=$_POST["datefields"]; $lc=$_POST["geofields"]; $Oc=$_POST["linkfields"]; $ld=1; Od($lb); $le=Oe($lb); $lf=array("table" => $la,"db" => $Oa,"dbprovider" => $lb,"datefields" => $Ob,"geofields" => $lc,"linkfields" => $Oc,"enablecache" => $ld); $Of=dbregistertable($lf); if ($Of !== FALSE) { $O1=$Of["id"]; $lg=$Of["rc"]; if ($lg === FALSE) { showmessage( __FILE__ ,TAG_ERROR_INTERNAL,msgerrorinternaltablesdir()); } else { switch ($lg) { case (RC_NOTE_TABLE_ADDED): showmessage("",TAG_NOTE,msgnotetableregistrationadded($la,$Oa,$O1,$ld)); break; case (RC_NOTE_TABLE_UPDATED): showmessage("",TAG_NOTE,msgnotetableregistrationupdated($la,$Oa,$O1,$ld)); break; case (RC_ERROR_NOTFOUND_DB): $Og=$Oa; if (lh($le)) { $Og=DATADIR."/$Oa"; } showmessage("",TAG_ERROR,msgerrorexternaldatabasenotfound($Og)); break; case (RC_ERROR_NOTFOUND_TABLE): $Og=$Oa; if (lh($le)) { $Og=DATADIR."/$Oa"; } showmessage("",TAG_ERROR,msgerrorexternaltablenotfound($la,$Og)); break; default : showmessage( __FILE__ ,TAG_ERROR_INTERNAL,msgerrorinternalreturncode($lg)); break; } } if ($Ob !== "" or $lc !== "" or $Oc !== "") { echo "<h4>The following fields were registered as fields of special type:</h4>\n"; $Oh=Oi($O1); if ($Oh == NULL || count($Oh) == 0) { echo "<em>No fields were registered as fields of special type.</em>\n"; } else { foreach ($Oh as $lj => $Oj) { if ($Oj === "date" || $Oj === "geo_point" || $Oj === "url") { echo "$Oj: $lj<br>"; } } } } }