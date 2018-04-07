<?php
/*
JSON_SQL_Bridge 1.1
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; function l6c($O6a,$O4h) { $O99=FALSE; if ($O4h) { $l4n=$O6a["responseFile"]; $l9a=$O6a["responseFileTmp"]; $l2f=l2c(CACHEDIR); if ($l2f === FALSE) { O2f( __FUNCTION__ ,l6,l6z(CACHEDIR).O9a()); return FALSE; } if (file_exists($l4n) && !O38($l4n)) { $O99=TRUE; } else if (file_exists($l9a)) { l99($l4n); if (file_exists($l4n)) { $O99=TRUE; } } } return $O99; } function O6d($O6a,$O4h) { if (file_exists($O6a["responseFileTmp"]) === TRUE) { $l98=l9b($O6a); if ($l98 !== FALSE && PHP_SAPI !== "cli") { if ($O6a["responseFile"] !== O6o(l3)) { setrawcookie(l3,$O6a["responseFile"],strtotime("+365 days"),"/".APPDIRNAME."/"); setrawcookie(O3,time(),strtotime("+365 days"),"/".APPDIRNAME."/"); setrawcookie(l4,$O4h*1,strtotime("+365 days"),"/".APPDIRNAME."/"); } } } } function l6b($l1x,$O69) { if (is_string($O69)) { $O9b=$O69; } else { $O9b=serialize($O69); } $l4n=CACHEDIR."/query_".$l1x."_".md5($l1x."\n".$O9b).".json"; $l9c="_tmp"; $l9a= "$l4n$l9c"; $O6a=array("responseFile" => $l4n,"responseFileTmp" => $l9a); return $O6a; } function O97($l39) { $O9c=explode("_",$l39); $l9d=$O9c[2]; $O4t=explode(".",$l9d)[0]; return $O4t; } function O6o($O9d) { if ( isset ($_COOKIE[$O9d])) { return $_COOKIE[$O9d]; } else { return ""; } } function l6e($l39,$l9e=5) { $l98=FALSE; $O9e=time(); $l9f=strlen(ob_get_contents()); while ($l98 === FALSE && (time()-$O9e)<=$l9e) { @readfile($l39); if (PHP_SAPI === "cli" || strlen(ob_get_contents())>$l9f && @filesize($l39)>0) $l98=TRUE; } return $l98; } function l9b($O6a,$l9e=5) { $l98=FALSE; $O9e=time(); while ($l98 === FALSE && (time()-$O9e)<=$l9e) { $l98=@rename($O6a["responseFileTmp"],$O6a["responseFile"]); } return $l98; } function O9f($l9g,$O3r="application/json") { header($_SERVER["SERVER_PROTOCOL"]." ".$l9g); header("Access-Control-Allow-Origin: *"); header( "Content-Type: $O3r; charset=UTF-8"); } function O9g($l67=TRUE) { $l9h=O6o(lx); if ($l9h == "") { l4x(Om,$l2e=FALSE); $O9h=O4k("select ".ll." from ".Om." LIMIT 1",KIBELLADB,TABLESDIR,$l4l="query",$O4l="sqlite"); if ($O9h !== FALSE && count($O9h)>0) { $O1w=$O9h[0][ll]; } else { $O1w=""; } } else { $O1w=$l9h; } $l9i="{\"".Oc."\":\"".l1."\",\"".ld."\":\"config\",\"".Od."\":\"".O1."\",\"".le."\":1,\"".lh."\":true,\"".lf."\":{"."\"buildNum\":1000,"."\"defaultIndex\":\"".$O1w."\""."}"."}"; if ($l67) { $l9i="{\"docs\":[".$l9i."]}"; } l20($l9i); } function O6u($O9i) { $l9j="{\"took\":2,\"timed_out\":false,\"".lg."\":{\"total\":1,\"successful\":1,\"failed\":0},"."\"hits\":{"."\"total\":".count($O9i).","."\"max_score\":1,"."\"hits\":".json_encode($O9i)."}"."}"; l20($l9j); } function O5m($O3r,$l5b,$l5m,$O9j,$l9k) { $l9j="{\"".Oc."\":\"".l1."\",\"".ld."\":\"".$O3r."\",\"".Od."\":\"".$l5b."\",\"".le."\":".$l5m.",\"".lg."\":{\"total\":2,\"successful\":1,\"failed\":0},\"".$O9j."\":".$l9k."}"; l20($l9j); } function O9k($O9d,$l26,$l9l="",$O9l=NULL,$l9m=NULL) { if ($O9l === NULL) $O9l=strtotime("+365 days"); if ($l9m === NULL) $l9m="/".APPDIRNAME."/"; if ($l9l === "raw") { setrawcookie($O9d,$l26,$O9l,$l9m); } else { setcookie($O9d,$l26,$O9l,$l9m); } } function O9m($l9n,$O9n,$l9o) { $O9o=""; $l9p=""; if (strtolower($l9o) == "begin") { if ($O9n == "" || $O9n == NULL) { $O9p=$l9n; $O9n=""; } else $O9p=str_replace($O9n."/","",$l9n); $O2z=0; $l9q=""; if ($O9p[0] == "/") { $O2z=1; $l9q="/"; } if ($O9n == "") $O9q=""; else $O9q=$l9q.$O9n; $l9o=strpos($O9p,"/",$O2z); if ($l9o !== FALSE) { $O9o=$O9q.substr($O9p,$l9o); $l9p=substr($O9p,$O2z,$l9o-$O2z); } else { $l9r=O9r($l9n); $l9s=$l9r["URI"]; $l9p=substr($l9s,$O2z); } } else { $l9r=O9r($l9n); $l9s=$l9r["URI"]; $O9s=strlen($l9s); if ($l9s[$O9s-1] == "/") $l9s=substr($l9s,0,$O9s-1); $l9o=strrpos($l9s,"/"); if ($l9o !== FALSE) { if ($l9o<strlen($l9s)-1) $l9p=substr($l9s,$l9o+1); $O9o=substr($l9s,0,$l9o+1); } else $l9p=$l9s; } return array("URI" => $O9o,"object" => $l9p); } function O9r($l9n) { $l9o=strpos($l9n,"?"); if ($l9o === FALSE) { $l9t=$l9n; $l23=NULL; } else { $l9t=substr($l9n,0,$l9o); if ($l9o == strlen($l9n)-1) { $l23=NULL; } else { $O9t=substr($l9n,$l9o+1); $l9u=explode("&",$O9t); $l23=l2o("=",$l9u); } } return array("URI" => $l9t,"params" => $l23); } function O6r($O20) { $O20=preg_replace("/\\s+/","-",$O20); return $O20; } function O9u($O20) { $O20=urldecode($O20); return $O20; } function l99($O2k,$l9v=O2) { $O9e=time(); while (!file_exists($O2k) && (time()-$O9e)<=$l9v) { sleep(1); } }