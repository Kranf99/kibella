<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
/** Delete the application's cache */
namespace kibella;
require_once 'config.php';
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
