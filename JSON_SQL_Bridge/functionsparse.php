<?php
/*
JSON_SQL_Bridge 1.1
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; function l75($O69,$O1w,$l1w) { $l22=json_decode($O69,TRUE); $l1x=O1x($O1w,$l1w); $O5g=O5y($l1x); $O51=O21($l22,"kibella\\parseEsJsonQueryElement",array("fieldtypes" => $O5g)); return $O51; } function parseesjsonqueryelement($l26,$O3b,$O23,$l24,$O24,$l23) { static $O75; static $l76; static $O76; static $l77; static $O77; static $l78; static $O78; static $l79; static $O79; static $l7a; static $O7a; static $l7b; static $O7b; static $l7c; static $O7c; static $l7d; static $O7d; static $l7e; static $O7e; static $l7f; static $O7f; static $l7g; static $O7g; static $l7h; static $O7h; static $l7i; static $O7i; static $l7j; static $O7j; static $l7k; static $O7k; static $l7l; static $O7l; static $l7m; static $O7m; static $l7n; static $O7n; static $l7o; static $O7o; static $l7p; static $O7p; static $l7q; global $O7q; global $l7r; if ($O23 == 0 && $l24 == 0) { $O75=array(); $l76=array(); $O76=array(); $l77=array("level" => 0,"context" => array(l1i),"idx" => array(-1),"size" => array($O24)); $l78=array(); $O78=FALSE; $l79=FALSE; $O79=FALSE; $l7a=-1; $O7a=NULL; $l7b=NULL; $O7b=NULL; $l7c=NULL; $O7c=NULL; $l7d=NULL; $O7d=DISCOVERSIZE; $l7e=NULL; $O7e=NULL; $l7f=NULL; $l7g=NULL; $O7f=NULL; $O7g=NULL; $l7h=NULL; $O7h=NULL; $l7i=""; $O7i=Oz; $l7j=""; $O7j=NULL; $l7k=NULL; $O7k=NULL; $l7l=""; $O7l=""; $l7m=NULL; $O7m=""; $l7n=NULL; $O7n=NULL; $l7o=NULL; $O7o=NULL; $l7p=NULL; $O7p=NULL; $l7q=""; if (array_key_exists("fieldtypes",$l23)) $O75=$l23["fieldtypes"]; } if ($l24>$l77["level"]) { return $O77; } $l77["idx"][$l77["level"]]++; if (is_array($l26) && count($l26)>0) { $l77["level"]++; $l3c=$l77["context"][$l77["level"]-1]; $O3b=l3b($O3b,$l3c); if (array_search(NULL,$O7q[$l3c]) !== FALSE || array_search(( string) $O3b,$O7q[$l3c]) !== FALSE || $l3c == O14 && array_search(( string) $O3b,$O7q[O14][0]) !== FALSE) { if ($O3b === l14) { $l7a ++; } else if ($O3b === O1c) { $O78=TRUE; } switch ($l3c) { case (l14): $l7h=$O3b; $l77["context"][]=O14; $O7n="(CASE"; break; case (O14): if ($O25=array_search($O3b,$O7q[O14][0]) !== FALSE) { $l7p=$l7r[$O3b]; $l77["context"][]=O1j; } else if ($O25=array_search($O3b,array_slice($O7q[O14],1)) !== FALSE) { $l77["context"][]=$O3b; } else l6v($O3b,$l3c,$O7q,"COMPOUND",2); break; case (l16): if ($O3b === l1e) $l7j=""; else if ($O3b === O1e) $l7j=" not "; $l77["context"][]=$O3b; break; case (O19): if (strpos($O3b,"(CASE WHEN ") === 0) { $O7f=$O3b; } else { $O7f=l2l($O3b); } $l77["context"][]=l1a; break; case (O1a): $l7g=l2l($O3b); $l77["context"][]=l1b; break; case (O17): $O7r=l2l($O3b); $l7s=l2u($O3b); $O7e=l2l($l7s."_".O1o); $l7f=l2l($l7s."_".l1o); $l77["context"][]=O18; break; case (O18): switch (( string) $O3b) { case (l18): case (l19): $l77["context"][]=$O3b; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; default : if (gettype($O3b) == "integer") { $O7s=end($l77["size"]); reset($l77["size"]); if ($O7s>1) { $O23=$O3b; if ($O23 == $O7s-1) { $O7l=")"; } if ($O23 == 0) { $l7l="("; } else { $O7i=" and "; $l7l=""; if ($O23<$O7s-1) $O7l=""; } } $l77["context"][]=$l3c; } else $l77["context"][]=$O3b; break; } } else { l6v($O3b,$l3c,$O7q,"COMPOUND",1); $l77["context"][]=$l3c; } if (DEBUG) { echo "CONTEXT history\n"; print_r($l77["context"]); } $l77["idx"][]=-1; $l77["size"][]=count($l26); $l3c=$l77["context"][$l77["level"]]; if (DEBUG) echo "Keyword: $O3b => Entering context ".$l3c."... (field aggregation level is $l7a)\n"; } else { $l24=$l77["level"]; $l2v=$l77["idx"][$l24]; $O7s=$l77["size"][$l24]; $l3c=$l77["context"][$l24]; $O3b=l3b($O3b,$l3c); switch ($l3c) { case (l1d): case (O1d): $l76[$l7a]["ofield"]=$l7h; if ($l3c == l1d) $l76[$l7a]["type"]="h"; else $l76[$l7a]["type"]="hd"; $l76[$l7a]["order"]=l2l($l7h); $l76[$l7a]["limit"]=""; switch (( string) $O3b) { case (l1m): $O7g=l2l($l26); $l76[$l7a]["ifieldname"]=$O7g; $l76[$l7a]["ifield"]=$O7g; break; case (l1q): $l76[$l7a]["interval"]=$l26; break; case (l1s): break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l1c): $l76[$l7a]["ofield"]=$l7h; $l76[$l7a]["type"]="g"; $l76[$l7a]["order"]=l2l($l7h); $l76[$l7a]["limit"]=""; switch (( string) $O3b) { case (l1m): $O7g=$l26; $l76[$l7a]["ifieldname"]=l2l(l2u($O7g)); break; case (l1t): $l76[$l7a]["ifield"]=l2l(l2u($O7g)."_geohash".$l26); break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l18): switch (( string) $O3b) { case (l1o): $l7c=$l26; break; case (O1o): $O7a=$l26; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l19): switch (( string) $O3b) { case (l1o): $O7b=$l26; break; case (O1o): $l7b=$l26; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l1a): switch (( string) $O3b) { case (O1s): $O7i=$l26; break; case (O1t): $O7p=$l26; break; case (O1v): if ($l26 === "phrase") $O7m="'"; else $O7m=""; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (O1f): if ($O3b === O1k) { $O7k=$l7r[O11]."(*)"." ".$l26; } else { $O7k=l2l($O3b)." ".$l26; } $l76[$l7a]["order"]=$O7k; break; case (O1g): switch (( string) $O3b) { case (l1k): break; case (O1t): if ($l26 === "*") $l7m=1; else $l7m=$l26; $l78[]=trim($l7m); break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l15): case (O15): $l76[$l7a]["ofield"]=$l7h; if ($l3c == l15) { $l76[$l7a]["type"]="r"; } else { $l76[$l7a]["type"]="rd"; } $l76[$l7a]["order"]=l2l($l7h); $l76[$l7a]["limit"]=""; switch (( string) $O3b) { case (l1m): $O7g=l2l($l26); $l76[$l7a]["ifieldname"]=$O7g; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l1b): switch (( string) $O3b) { case (l1n): $O7h=$l26; break; case (l1p): case (O1p): $l7d=$l26; if ($O3b === l1r) $O7j=">"; else $O7j=">="; break; case (l1r): case (O1r): $O7c=$l26; if ($O3b === l1r) $l7k="<"; else $l7k="<="; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (O1h): switch (( string) $O3b) { case (O1n): if ($l76[$l7a]["type"] == "rd") { $l26=l30($l26); } $l7n=$l26; $l7o=$l26."-"; break; case (l1v): if ($l76[$l7a]["type"] == "rd") { $l26=l30($l26); } $O7o=$l26; $l7o.=$l26; $O7n.="\n\tWHEN ".$l7n." <= ".$O7g." AND ".$O7g." < ".$O7o." THEN "."'".$l7o."'"; $l76[$l7a]["ranges"][]=$l7o; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l1i): if ($O3b === O1u) { $O7d=$l26; $l7i=O3e($O7d); } else l6v($O3b,$l3c,$O7q,"LEAF"); break; case (O1j): switch (( string) $O3b) { case (l1m): $l7e=l2l($l26); break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; case (l1j): $l76[$l7a]["ofield"]=$l7h; $l76[$l7a]["type"]="t"; switch (( string) $O3b) { case (l1m): $O7g=l2l($l26); $l76[$l7a]["ifieldname"]=$O7g; $l76[$l7a]["ifield"]=$O7g; break; case (O1u): $l7i=O3e($l26); $l76[$l7a]["limit"]=$l7i; break; default : l6v($O3b,$l3c,$O7q,"LEAF"); break; } break; default : O6x($l3c,"LEAF"); break; } while ($l2v == $O7s-1 && $l24>=0) { if (DEBUG) echo "\tRemoving data from level: ".$l24."\n"; $l24 --; $l77["level"]=$l24; foreach (array_slice($l77,1) as $l7t => $O7t) { array_pop($l77[$l7t]); } assert($l24>=-1,"\$level >= -1"); if ($l24>=0) { switch ($l3c) { case (O14): $l7e=NULL; $l7h=NULL; $l7p=NULL; break; case (l15): case (O15): assert(!is_null($O7n) && !is_null($l7h),"C_AGGS_RANGE: Range grouping ($O7n), FieldOut ($l7h) are not null"); $O7n.="\nEND)"; $l76[$l7a]["ifield"]=$O7n; break; case (l18): case (l19): case (l1a): case (l1b): case (O1g): if ($l3c == l18 && !is_null($O7e) && !is_null($l7f) && !is_null($O7a) && !is_null($l7c)) { if (!$O79) { $l7u="("; $O7u=""; } else { $l7u=""; $O7u=")"; } $l7m=$l7u.$l7c." <= ".$l7f." and ".$O7e." <= ".$O7a.$O7u; $l79=TRUE; } else if ($l3c == l19 && !is_null($O7e) && !is_null($l7f) && !is_null($l7b) && !is_null($O7b)) { if (!$l79) { $l7u="("; $O7u=""; } else { $l7u=""; $O7u=")"; } $l7m=$l7u.$l7b." <= ".$O7e." and ".$l7f." <= ".$O7b.$O7u; $O79=TRUE; } else if ($l3c == l1a && !is_null($O7f) && !is_null($O7p)) { $l7m=$O7f." = ".$O7m.l2n($O7p).$O7m; } else if ($l3c == l1b && !is_null($l7d) && !is_null($O7c)) { if (array_key_exists($l7g,$O75) && $O75[$l7g] === "date") { $l7g=$l7g."*1000"; } $l7m= "$l7g $O7j $l7d and $l7g $l7k $O7c"; } $l7v=$l7l.$l7j; if ($l7q == "") $l7q="WHERE"; else { if (($l79+$O79)<2) $l7v=$O7i.$l7l.$l7j; else $l7v=$O7i.$l7l; } if (!is_null($l7m)) { $l7q.="\n".$l7v."(".$l7m.")".$O7l; } $l78[]=trim($l7j.$l7m); $l7l=""; $O7l=""; $O7i=Oz; $O7j=NULL; $l7k=NULL; if ($l79 && $O79) { $O7e=NULL; $l7f=NULL; $l79=FALSE; $O79=FALSE; } $O7a=NULL; $l7b=NULL; $O7b=NULL; $l7c=NULL; $O7c=NULL; $l7d=NULL; $O7f=NULL; $l7g=NULL; $O7p=NULL; $l7m=NULL; break; case (O1f): assert(!is_null($O7k),"C_ORDER: Order statistic ($O7k) is not null"); break; case (O1j): assert(!is_null($l7e) && !is_null($l7h) && !is_null($l7p),"C_STATISTIC: Field ($l7e), FieldOut ($l7h), Statistic ($l7p) are not null"); $O7u=str_repeat(")",substr_count($l7p,"(")); $O76[$l7h]=$l7p."(".$l7e.")".$O7u; $l7e=NULL; break; case (l1j): assert(!is_null($O7g) && !is_null($l7h),"C_TERMS: Grouping field ($O7g), FieldOut ($l7h) are not null"); break; default : break; } $l2v=$l77["idx"][$l24]; $O7s=$l77["size"][$l24]; if ($l3c == l14) { $l7a --; } $l3c=$l77["context"][$l24]; } else { if (DEBUG) echo "REACHED LAST KEY-VALUE PAIR\n"; if ($O78 === TRUE) { $l7i=O3e(DISCOVERSIZE); } $O77=array("xaggs" => $l76,"yaggs" => $O76,"filterArray" => $l78,"filter" => $l7q,"discover" => array("tab" => $O78,"limit" => $l7i)); return $O77; } } } } function O7v($l7w) { $O7w=array(); foreach ($l7w["xaggs"] as $l3x) { $O7w[]=O26($l3x); } $O7w[]=O26($l7w["yaggs"]); $O7w[]=$l7w["filterArray"]; sort($O7w[count($O7w)-1]); $O7w[]=O26($l7w["discover"]); return $O7w; } function l6d($O1w,$l1w,$l7x,$l4n) { $O3w=$l7x["xaggs"]; $O7x=$l7x["yaggs"]; $l7y=$l7x["filter"]; $O7y=$l7x["discover"]; $l7z=fopen($l4n,"wt"); if (!$l7z) { O2f( __FUNCTION__ ,l6,"Error opening or creating file $l4n\n. An empty response will be returned.\n"); return ""; } $O7z=dbdbhcreate($l1w,$O2c=DATADIR,$l4l="sqlite",$O53=array("flags" => SQLITE3_OPEN_READONLY)); $l80= "SELECT count(*) from $O1w"."\n".$l7y; $O80=dbdbhexecutesqlquery($O7z,$l80); if ($O80 === FALSE) { $l81=0; } else { $l81=$O80[0]["count(*)"]; } if (DEBUG) { echo "\nTotal Hits:\n"; print_r($O80); } O81($l7z,$l81); if ($O7y["tab"] === TRUE && count($O3w) == 0 && count($O7x) == 0) { l20("[",$l21=$l7z); $l1x=O1x($O1w,$l1w); $O5g=O5y($l1x); $l82="SELECT rowid as _id"; $O5d=array(); foreach ($O5g as $l40 => $O3r) { if ($O3r === "date") { $l82.=", ".$l40." as ".$l40; $O5d[]=str_replace("\"","",$l40); } else if ($O3r === "geo_point") { if (l51($l40,$O1w,$l1w,$O2c,$O4l="sqlite") === TRUE) $l82.=", ".$l40; } else { $l82.=", ".$l40; } } $l58=$l82."\nFROM ".$O1w."\n".$l7y."\nORDER BY _id"."\n".$O7y["limit"]; $l59=O6f($O7z,$l58); if ($l59 !== FALSE) { $O82=""; while ($O4q=l6g($l59)) { $l5b=$O4q["_id"]; foreach ($O5d as $l83) { $O83=date_create(strftime("%Y-%m-%d %H:%M:%S",$O4q[$l83])); $l2z=(array) $O83; $O2z=timezone_offset_get(new \datetimezone($O83->timezone),$O83); $O4q[$l83]=($O4q[$l83]-$O2z)*01750; } $l84=($l81-$l5b)/$l81; $O84=$O82."{"."\"".Oc."\":\"".$l1x."\","."\"".ld."\":\"row\","."\"".Od."\":\"".$l5b."\","."\"".Oe."\":".$l84.","."\"".lf."\":".json_encode($O4q)."}"; l20($O84,$l21=$l7z); $O82=","; } unset ($O4q); } unset ($l59); l20("]}",$l21=$l7z); } else { l20("[]}",$l21=$l7z); if (count($O3w)>0 || count($O7x)>0) { l20(",\"aggregations\":{",$l21=$l7z); if (count($O3w) == 0) { $O82=""; $l85=""; foreach ($O7x as $O85 => $l86) { $l85.= "\n\t$O82".$l86." as ".l2l($O85); $O82=","; } $l58="SELECT".$l85."\nFROM ".$O1w."\n".$l7y; $O86=dbdbhexecutesqlquery($O7z,$l58,$l4l="query"); if ($O86 !== FALSE) { l87($l7z,$O86[0],0); } } else { $O87=":memory:"; $l88=dbdbhcreate($O87,$O2c="",$l4l="sqlite"); $O88="attach database '".$O87."' as ".Oj; dbdbhexecutesqlquery($O7z,$O88,$l4l="exec"); $O3r=$O3w[0]["type"]; $l89=O89($O3w[0],$O7x,Oj."._T0",$O1w,$l7y,$O7z); if (DEBUG) { echo "Output filename: $l4n\n"; echo "\nCreating temporary table _T0 in database ".$O87."...\n"; echo $l89; } $l58=$l89; $l8a=dbdbhexecutesqlquery($O7z,$l58,$l4l="exec"); if ($l8a !== FALSE) { if (count($O3w)>1) { if (DEBUG) echo "\nRecurring to the lower grouping level...\n"; O8a($l7z,$O1w,$O7z,$l7y,"_T0",1,$O3w,array(),$O7x,""); } else { $l8b=O8b($O3w[0]["order"]); $l58="select * from ".Oj."._T0 order by $l8b"; if (DEBUG) echo "\nSQLQUERY: $l58\n"; $l8c=array("sqlquery" => $l58,"db" => $O7z,"dbtype" => "sqlite","dir" => TABLESDIR); $O8c=l8d($l7z,$O3r,0,$O3w,$l8c); if ($O8c>0) O8d($l7z,$O3r); } } $l8e="DETACH DATABASE ".Oj; dbdbhexecutesqlquery($O7z,$l8e,$l4l="exec"); $l88->close(); unset ($l88); O8e($O87); } l20("}",$l21=$l7z); } } l20("}",$l21=$l7z); $O7z->close(); unset ($O7z); fclose($l7z); } function O8a($l3k,$l8f,$O7z,$l7y,$O8f,$l24,$O3w,$l8g,$O7x,$O8g) { assert($l24>0,"Grouping level is larger than 0"); assert(count($O3w)>$l24,"The xaggs array has more than \$level elements (count(\$xaggs)=".count($O3w).", level=$l24)"); assert(count($l8g) == $l24-1,"The aGroupValuesAndTypes array has \$level-1 elements (count(\$aGroupValuesAndTypes)=".count($l8g).", level-1=$l24-1)"); $l8h=$O3w[$l24-1]["ofield"]; $O8h=$O3w[$l24-1]["type"]; $l8i=O8b($O3w[$l24-1]["order"]); $l58="select * from ".Oj.".$O8f order by $l8i"; $l59=O6f($O7z,$l58); $O8i=TEMPDIR."/$O8f"; $l8j=fopen($O8i,"wt"); if (!$l8j) { O2f( __FUNCTION__ ,l6,"Cannot open temporary file $O8i for writing. Check directory permissions.\n"); } while ($O4q=l6g($l59)) { $O8j=array_keys($O4q); $l8k=implode("|",$O4q); fwrite($l8j,$l8k."\n"); } fclose($l8j); unset ($O4q); unset ($l59); $l8j=fopen($O8i,"r"); if (!$l8j) { user_error( "Cannot open temporary file $O8i for reading" ,E_USER_ERROR); } $O8k=-1; $O82=""; while (($l8k=fgets($l8j)) !== FALSE) { $O8k ++; if (DEBUG) echo "Reading row $O8k...\n"; $l8k=preg_replace("/[\n\r]\$/","",$l8k); $l8l=explode("|",$l8k); $O4q=array_combine($O8j,$l8l); $O8l=$O4q[$l8h]; if ($O8k == 0) { l8m($l3k,$O8h,$l24-1,$l8h); $O8g.= "_$O8k"; $l8g[]=array("value" => $O8l,"type" => $O8h); } else { $O8g=substr_replace($O8g,$O8k,strrpos($O8g,"_")+1); $l8g[$l24-1]=array("value" => $O8l,"type" => $O8h); } O8m($l3k,$O8h,$O4q,$O82); $l8n=""; for ($O8n=0; $O8n<$l24; $O8n ++) { $l8o=$O3w[$O8n]["ifield_parsed"]; $O8o=$l8g[$O8n]["value"]; $l8p=$l8g[$O8n]["type"]; if ($l8p == "t" || $l8p == "r" || $l8p == "rd") $O8p="'".l2n($O8o)."'"; else $O8p=$O8o; $l8n.=" and ".$l8o." = ".$O8p; } if (strstr($l7y,"WHERE") === FALSE) { $l8n=preg_replace("/[ ]+and[ ]+/","WHERE ",$l8n,1); } $l8q=$l7y.$l8n; $l89=O89($O3w[$l24],$O7x,Oj."._S$O8g" ,$l8f,$l8q,$O7z); if (DEBUG) { echo "\n".str_repeat("\t",$l24)."SQLQUERY Level $l24:\n"; echo "\nCreating temporary table _S$O8g in temporary database...\n"; echo $l89; } $l58=$l89; dbdbhexecutesqlquery($O7z,$l58,$l4l="exec"); if ($l24<count($O3w)-1) { if (DEBUG) echo "Recurring again...\n"; O8a($l3k,$l8f,$O7z,$l7y,"_S$O8g" ,$l24+1,$O3w,$l8g,$O7x,$O8g); } else { $O3r=$O3w[$l24]["type"]; $l8b=O8b($O3w[$l24]["order"]); $l58="select * from ".Oj."._S$O8g order by $l8b"; if (DEBUG) { echo "\n****** END OF RECURSION (level = $l24, last table ID: $O8g)\n"; echo "The table is for group combo:\n"; for ($O8n=0; $O8n<$l24; $O8n ++) { $l8o=$O3w[$O8n]["ifield"]; $O8o=$l8g[$O8n]["value"]; echo "$l8o = '$O8o'\n"; } echo "****** END OF RECURSION\n"; } $l8c=array("sqlquery" => $l58,"db" => $O7z,"dbtype" => "sqlite","dir" => TABLESDIR); $O8c=l8d($l3k,$O3r,$l24,$O3w,$l8c); if ($O8c>0) { if (DEBUG) echo "Closing Lowest level $l24...\n"; O8d($l3k,$O3r); } } if (DEBUG) echo "Closing Group value $O8k at level ($l24 - 1)...\n"; l20("}",$l21=$l3k); $O82=","; } fclose($l8j); if (!unlink($O8i)) { user_error( "Could not delete temporary file $O8i" ,E_USER_WARNING); } if ($O8k>=0) O8d($l3k,$O8h); } function O8b($l8b,$O8q="_count") { return str_ireplace("count(*)",$O8q,$l8b); } function O8e($O87) { if ($O87 !== ":memory:") { unlink($O87); } } function O89(&$O3w,$O7x,$l8r,$O8f,$l7y,$l50) { global $l41; $O3n=$O3w["ofield"]; $O8r=l2l($O3n); $O3r=$O3w["type"]; $l3s=$O3w["ifield"]; $l8b=$O3w["order"]; $l8s=$O3w["limit"]; switch ($O3r) { case ("r"): case ("rd"): assert(count($O3w["ranges"])>0,"There is at least one RANGE value"); $l58="CREATE TABLE ".Oj."._ranges (_range TEXT, _range_from NUMBER);"; foreach ($O3w["ranges"] as $O8s) { $l8t=l35($O8s); $O8t=$l8t[0]; if ($O8t === "") $O8t="NULL"; $l58.="\nINSERT INTO ".Oj."._ranges values ('$O8s', $O8t);"; } if (DEBUG) { echo "SQL for _RANGES:\n"; echo $l58."\n"; } O57($l50,Oj."._ranges"); dbdbhexecutesqlquery($l50,$l58,$l4l="exec"); if (DEBUG) { echo "RESULT _ranges:\n"; $O58=dbdbhexecutesqlquery($l50,"select * from ".Oj."._ranges"); print_r($O58); } $l8b="_range_from"; $l8u=$l3s; $O3w["ifield_parsed"]=$l8u; break; case ("h"): case ("hd"): $O3s=$O3w["interval"]; $l58= "SELECT min($l3s) as _min, max($l3s) as _max FROM $O8f $l7y"; $O8u=dbdbhexecutesqlquery($l50,$l58,$l4l="query"); if ($O8u === FALSE || count($O8u) == 0) { $l8u=""; } else { if ($O8u[0]["_min"] === "" || $O8u[0]["_max"] === "") { $l8u="(CASE WHEN 1 THEN null END)"; } else { if ($O3r == "h") { assert($O3s>0,"The histogram interval value (bin size) is positive"); $l8v=floor($O8u[0]["_min"]/$O3s)*$O3s; $O8v=$O8u[0]["_max"]; $l8w=floor(($O8v-$l8v)/$O3s)+1; if ($l8w == 0) $O8w=1; $l8x="(CASE"; $O8x=$l8v; for ($O2h=0; $O2h<$l8w; $O2h ++) { $l8y=$O8x+$O3s; $l8x.= "\n\tWHEN $O8x <= $l3s AND $l3s < $l8y THEN $O8x"; $O8x=$l8y; } } else { $O42=date_create(gmstrftime("%Y-%m-%d %H:%M:%S",$O8u[0]["_min"]),new \datetimezone("UTC")); $l43=(array) $O42; $O32=max(1,round(substr($O3s,0,strlen($O3s)-1)))*1; $l33=substr($O3s,strlen($O3s)-1); assert($O32>0,"The step is positive (value given: $O32)\n"); assert(array_key_exists($l33,$l41) !== FALSE,"The period definition is one of the 7 valid one (value given: $l33)\n"); $O8y=$O8u[0]["_max"]-$O8u[0]["_min"]; if ($l33 === "s" && $O8y>01274) { $O32=1; $l33="m"; } if ($l33 === "m" && $O8y/074>01274) { $O32=1; $l33="h"; } $O3w["interval"]=$O32.$l33; l34($O42,$l33); $l8v=date_timestamp_get($O42); $O8v=$O8u[0]["_max"]; $l8x="(CASE"; $O8x=$l8v; while ($O8x<=$O8v) { date_modify($O42,"$O32 ".$l41[$l33]); $l43=(array) $O42; $l8y=date_timestamp_get($O42); $l8z=$O8x; $l8x.= "\n\tWHEN $O8x <= $l3s AND $l3s < $l8y THEN $l8z"; $O8x=$l8y; } } $l8u=$l8x."\nEND)"; } $O3w["ifield_parsed"]=$l8u; } break; default : $l8u=$l3s; $O3w["ifield_parsed"]=$l8u; break; } $O8z=$l8u." as ".$O8r; $l85=""; $l90=""; foreach ($O7x as $O85 => $l86) { $l85.="\n\t,".$l86." as ".l2l($O85); $l90.="\n\t,".l2l($O85); } $l82="SELECT"."\n\t".$O8z."\n\t,count(*) as _count".$l85."\nFROM ".$O8f."\n".$l7y."\nGROUP BY ".$l8u; $l58= "CREATE TABLE $l8r as"; if ($O3r == "r" or $O3r == "rd") { $l58.="\nSELECT"."\n\ta._range as ".$O8r."\n\t,IFNULL(b._count,0) as _count".$l90."\nFROM ".Oj."._ranges a"."\nLEFT JOIN ("."\n\t".$l82."\n\t\t) b"."\nON a._range = b.".$O8r; } else { $l58.="\n".$l82; } assert($l8b != NULL && $l8b != "","Order variable is not null nor empty"); $l58.="\nORDER BY ".$l8b."\n".$l8s; return $l58; } function O81($l3k,$l81) { $O90="{"; $l91="\"took\":0,"."\"timed_out\":false,"."\"_shards\":{"."\"total\":5,"."\"successful\":5,"."\"failed\":0"."},"; $O91="\"hits\":{"."\"total\":".$l81.","."\"max_score\":0,"."\"hits\":"; l20($O90.$l91.$O91,$l21=$l3k); } function l8m($l3k,$O3r,$l24,$O3n) { $l92=""; $O82=","; if ($l24 == 0) $O82=""; $O20=$O82.l2l($O3n).":{"; switch ($O3r) { case ("t"): $O20.="\"doc_count_error_upper_bound\":0,"; $O20.="\"sum_other_doc_count\":0,"; $l92="["; break; case ("g"): case ("h"): case ("hd"): $l92="["; break; case ("r"): case ("rd"): $l92="{"; break; default : break; } $O20.="\"".O16."\":".$l92; l20($O20,$l21=$l3k); } function O8m($l3k,$O3r,$O92,$O82) { l93($l3k,$O3r,$O92,$O82); l87($l3k,$O92); } function l8d($l3k,$O3r,$l24,$O3w,$l8c) { $l1w=$l8c["db"]; $l58=$l8c["sqlquery"]; $l59=O6f($l1w,$l58); $O4q=l6g($l59); $O82=""; $O8c=0; if ($O4q) { l8m($l3k,$O3r,$l24,$O3w[$l24]["ofield"]); do { $O8c ++; l93($l3k,$O3r,$O4q,$O82); l87($l3k,$O4q); l20("}",$l21=$l3k); $O4q=l6g($l59); $O82=","; } while ($O4q); } unset ($O4q); unset ($l59); return $O8c; } function l93($l3k,$O3r,$O92,$O82="") { $O27=array_keys($O92); $l26=$O92[$O27[0]]; $O20=$O82; switch ($O3r) { case ("t"): case ("g"): case ("h"): case ("hd"): $O20.="{"; if (O3a($l26) === FALSE) $O93=l2l($l26); else { if ($O3r == "hd") { if (PHP_SAPI !== "cli") { $l26=l2y($l26); } $O93=$l26*01750; } else $O93=$l26; } $O20.="\"key\":".$O93.","; break; case ("r"): case ("rd"): $O20.=l2l($l26).":{"; $O43=l35($l26); $O37=$O43[0]; $l38=$O43[1]; if ($O3r == "rd") { if (PHP_SAPI !== "cli") { $O37=l2y($O37); $l38=l2y($l38); } $O37=$O37*01750; $l38=$l38*01750; } $O20.="\"from\":".$O37.","; $O20.="\"from_as_string\":".l2l($O37).","; $O20.="\"to\":".$l38.","; $O20.="\"to_as_string\":".l2l($l38).","; break; default : break; } $O20.="\"doc_count\":".$O92["_count"]; l20($O20,$l21=$l3k); } function l87($l3k,$O92,$l94=2) { $O27=array_keys($O92); $O94=count($O92); if ($l94 == 0) { $O82=""; } else { $O82=","; } $O20=""; for ($O2h=$l94; $O2h<$O94; $O2h ++) { $l40=$O27[$O2h]; $l26=$O92[$O27[$O2h]]; $O20.=$O82.l2l($l40).":{"; if ($l26 === NULL || $l26 === "") $O20.="\"value\":null"; else $O20.="\"value\":".$l26; $O20.="}"; $O82=","; } l20($O20,$l21=$l3k); } function O8d($l3k,$O3r) { $l95=""; switch ($O3r) { case ("t"): case ("g"): case ("h"): case ("hd"): $l95="]"; break; case ("r"): case ("rd"): $l95="}"; break; default : break; } $O20=$l95."}"; l20($O20,$l21=$l3k); }