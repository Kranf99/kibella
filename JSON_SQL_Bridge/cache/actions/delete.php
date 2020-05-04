<?php
/*
 JSON_SQL_Bridge
 Copyright 2016 Frank Vanden berghen
 All Right reserved.

 JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License".
 If you are interested in distributing, reselling, modifying, contibuting or in general creating
 any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
 */

namespace kibella;

require_once __DIR__ . '/../../config.php';

checkDirExistsOrCreate(CACHEDIR);    // Create the cache directory if it does not exist (e.g. the user deleted it by mistake)
$success = deleteDir(CACHEDIR, $contents_only = TRUE);
if ($success) {
    echo "All application's cache has been succesfully deleted from '" . CACHEDIR . "'.";
} else {
    echo 'An error occured while deleting the cache';
    http_response_code(500);
}
