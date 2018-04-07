<?php
/*
JSON_SQL_Bridge 1.1
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; require_once "config.php"; ob_start(); O9f("200 OK"); $l9n=$_SERVER["REQUEST_URI"]; $la8=$_SERVER["REQUEST_METHOD"]; $l96=file_get_contents("php://input"); $O65=json_decode($l96,TRUE); $Oa8=l1; if (preg_match( "/$Oa8%2C/" ,$l9n)) { if (array_key_exists("docs",$O65)) { l20("{\"docs\":["); for ($O2h=0; $O2h<count($O65["docs"]); $O2h ++) { $la9=$O65["docs"][$O2h]; if ($O2h>0) l20(","); O5m("","",1,lh,"false"); } l20("]}"); } } else if (preg_match("/_msearch/i",$l9n)) { O95($l96); $O65=explode("\n",$l96); if (count($O65)>1) { $l47=$O65[1]; O9k(Ox,$l47); } } else if (preg_match("/_mapping\\/field\\//i",$l9n)) { $Oa9=O9m($l9n,ESDIRNAME,"begin"); $l5b=$Oa9["object"]; l6f($l5b); } else if (preg_match("/index-pattern\\/\$/i",$l9n)) { $Oa9=O9m($l9n,ESDIRNAME,"begin"); $O1w=$Oa9["object"]; O5m("index-pattern",$O1w,1,lh,"true"); } else if (preg_match("/index-pattern\\/_search/i",$l9n)) { l6s(Om,lb,"*"); } else if (preg_match("/index-pattern/i",$l9n)) { $Oa9=O9m($l9n,ESDIRNAME,"end"); $l5b=$Oa9["object"]; if ($la8 == "POST") { O5m("index-pattern",$l5b,1,lh,"true"); } else if ($la8 == "DELETE") { l5k(Om,lb,$l5b); } } else if (preg_match("/_update\$/i",$l9n)) { O9k(lx,$O65["doc"]["defaultIndex"],$l9l="raw"); } else if (preg_match("/(dashboard|search|visualization)\\/_search/i",$l9n,$l32)) { assert(count($l32)>=2,"Variable \$matches with the matched pattern has at least 1 element (found ".count($l32).")"); $laa=$l32[1]; assert(array_key_exists("query",$O65),"Attribute 'query' exists in the request array"); if (array_key_exists("simple_query_string",$O65["query"]) && array_key_exists("query",$O65["query"]["simple_query_string"])) { $O4b=$O65["query"]["simple_query_string"]["query"]; } else { $O4b="*"; } l6s(Oq,$laa,$O4b); } else if (preg_match("/\\/dashboard|\\/search|\\/visualization/i",$l9n,$l32)) { assert(count($l32)>=1,"Variable \$matches with the matched pattern has at least 1 element (found ".count($l32).")"); $laa=substr($l32[0],1); $Oa9=O9m($l9n,ESDIRNAME,"end"); $l5b=$Oa9["object"]; if ($la8 == "POST") { $O6n=$l96; l6n($laa,$O6n); } else if ($la8 == "GET") { $l5b=O9u($l5b); O66($laa,$l5b,$l67=FALSE); } else if ($la8 == "DELETE") { $l5b=O9u($l5b); l5k(Oq,$laa,$l5b); } } else if (preg_match("/\\/_search/i",$l9n,$l32)) { $Oaa=str_replace($l32[0],"",$l9n); $Oa9=O9m($Oaa,ESDIRNAME,"end"); $l1x=$Oa9["object"]; if (count($O65["query"]["ids"]["values"])>0) { $l6a=$O65["query"]["ids"]["values"][0]; l69($l1x,$l96,$l6a); } } else if (preg_match("/_mget/i",$l9n)) { assert(array_key_exists("docs",$O65),"Attribute 'docs' exists in the request array"); assert(count($O65["docs"] == 1),"There is only one request in the request array"); if (array_key_exists(Od,$O65["docs"][0])) { $l5b=$O65["docs"][0][Od]; } else { $l5b=""; } if (array_key_exists(ld,$O65["docs"][0])) { $O3r=$O65["docs"][0][ld]; switch ($O3r) { case (la): O9g(); break; case (Oa): case (Ob): case (lc): O66($O3r,$l5b); break; case (lb): O6e($l5b); break; default : break; } } } else { $l9r=O9r($l9n); $l9s=$l9r["URI"]; $lab=str_replace("/".ESDIRNAME,"",$l9s); $lab=str_replace(l1,"_kibana_4",$lab); $lab=preg_replace("/[\\/\\-\\.\\*]/","_",$lab); if (function_exists( "kibella\\$lab")) { call_user_func( "kibella\\$lab"); } } ob_end_flush(); if (LOG) { fclose($O74); } exit;