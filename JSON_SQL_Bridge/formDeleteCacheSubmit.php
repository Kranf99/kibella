<?php
/*
JSON_SQL_Bridge 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
/** Delete the application's cache */
namespace kibella;
require_once 'config.php';

function checkDirExistsOrCreate($dir, $permissions=0744, $recursive=true, $log=false, $message="") {
	// Output variable
	$rc = true;

	// Create directory $dir if it does not exist
	if (!is_dir($dir)) {
		if ($log) showMessage("", TAG_WARNING, $message);
		$rc = mkdir($dir, $permissions, $recursive);
	}

	return $rc;
}

function deleteDir($dir, $contents_only=FALSE, $time=0) {
	// Ref: http://stackoverflow.com/questions/3349753/delete-directory-with-files-in-it
	if (!is_dir($dir)) {
		echo "<pre>ERROR: $dir must be a directory\nThe deletion process failed.\n</pre>";
		return false;
	}
	if (substr($dir, strlen($dir)-1, 1) != '/') {
		// Add a trailing slash to the directory if it is not present.
		$dir .= '/';
	}

	// Get all files inside the directory (glob() finds directories and files matching the specified pattern)
	$files = glob($dir . '*', GLOB_MARK);

	// Iterate on the directories and files inside $dir
	foreach ($files as $file) {
		if (is_dir($file)) {
			deleteDir($file);
		} else {
			// Check modification of file before deleting the file
			if ($time == 0 ||												// Delete the file regardless of its modification time
				$time < 0 && (time() - filemtime($file)) > abs($time) ||	// Delete the file based on a rolling time threshold (e.g. older than 24 hours from the file's modification time)
				$time > 0 && filemtime($file) < $time					)	// Delete the file based on a fixed time threshold (e.g. older than yesterday at 04:00)
			{
				unlink($file);
			}
		}
	}

	if (!$contents_only)
		rmdir($dir);
	
	return true;
}


checkDirExistsOrCreate(CACHEDIR);	// Create the cache directory if it does not exist (e.g. the user deleted it by mistake)
$success = deleteDir(CACHEDIR, $contents_only=TRUE);
if ($success) {
	echo "<pre>All application's cache has been succesfully deleted from '" . CACHEDIR . "'.</pre>";
}
?>
<html>
<body>

<button type="button" onclick="history.go(-1);">Go back to welcome page</button>

</body>
</html>