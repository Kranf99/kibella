<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
/** Delete the application's cache that is too old */
namespace kibella;
require_once 'config.php';
if (strtolower(CACHEMODE) === CACHEMODE_DAY) {
	$cutoff_time = computeCutOffTime(CACHEDAYCHANGE); 
}
else {
	// Rolling cut-off time (this is achieved by setting it to a negative value)
	$cutoff_time = -abs(CACHEHOURS)*3600;	// 3600 seconds in an hour
											// I use abs(CACHEHOURS) in case the user makes a mistake and specify a negative CACHEHOURS (e.g. -24 instead of 24)
}
checkDirExistsOrCreate(CACHEDIR);	// Create the cache directory if it does not exist (e.g. the user deleted it by mistake)
$success = deleteDir(CACHEDIR, $contents_only=TRUE, $time=$cutoff_time);
if ($success) {
	if ($cutoff_time > 0) {
		echo "<pre>Cache older than " . date('d F Y H:i:s', $cutoff_time) . " has been succesfully deleted from '" . CACHEDIR . "'.</pre>";
	}
	else {
		$cutoff_hours = abs($cutoff_time/3600);
		echo "<pre>Cache older than $cutoff_hours hours from now has been succesfully deleted from '" . CACHEDIR . "'.</pre>";
	}
}
?>
<html>
<body>

<button type="button" onclick="history.go(-1);">Go back to welcome page</button>

</body>
</html>
