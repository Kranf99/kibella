<?php
/*
 JSON_SQL_Bridge 1.0
 Copyright 2016 Frank Vanden berghen
 All Right reserved.

 JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License".
 If you are interested in distributing, reselling, modifying, contibuting or in general creating
 any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
 */

namespace kibella;

require_once __DIR__ . '/../../config.php';

/** Triggers the process to create a table index and register the table with the database where it is stored.
 * The database and table information are taken from the related form.
 * 
 * Following are the parameters that should be received as part of the POST request received from the form: 
 * <ul>
 * <li> db		name of the database where the table is located with no indication of the path (e.g. CensusIncome.sqlite) 
 * <li> table	name of the table for which the index should be created (e.g. census)
 * </ul> 
 * */

/*-------------------------- GET DATA FROM THE FORM ---------------------------*/
$table = $_POST['table'];
$db = $_POST['db'];
$dbtype = "sqlite";                        // In the future this attribute would be read from the form 
$datefields = $_POST['datefields'];        // This is expected to be a list of date fields separated by commas
$geofields = $_POST['geofields'];        // This is expected to be a list of geo-coordinate fields separated by commas
$linkfields = $_POST['linkfields'];        // This is expected to be a list of link fields separated by commas
$enablecache = $_POST['enablecache'];    // Flag 0/1 indicating whether to enable the cache for the table
$aTableInfo = array(
    'table'         => $table,
    'db'             => $db,
    'dbtype'         => $dbtype,
    'datefields'     => $datefields,
    'geofields'     => $geofields,
    'linkfields'     => $linkfields,
    'enablecache'    => $enablecache
);
/*-------------------------- GET DATA FROM THE FORM ---------------------------*/


/*---------------------------- REGISTER THE TABLE -----------------------------*/
// Save the table information in Kibella's database 
$aResult = dbRegisterTable($aTableInfo);
$id = $aResult['id'];    // Table ID
$rc = $aResult['rc'];    // Return code

// Check the return code and show a message accordingly
if ($rc === FALSE) {
    showMessage(__FILE__, TAG_ERROR_INTERNAL,     msgErrorInternalTablesDir());
} else {
    switch ($rc) {
        case (RC_NOTE_TABLE_ADDED):
            showMessage("", TAG_NOTE, msgNoteTableRegistrationAdded($table, $db, $id, $enablecache));
            break;
        case (RC_NOTE_TABLE_UPDATED):
            showMessage("", TAG_NOTE, msgNoteTableRegistrationUpdated($table, $db, $id, $enablecache));
            break;
        case (RC_ERROR_NOTFOUND_DB):
            showMessage("", TAG_ERROR, msgErrorDatabaseNotFound(DATADIR . "/" . $db));
            break;
        case (RC_ERROR_NOTFOUND_TABLE):
            showMessage("", TAG_ERROR, msgErrorTableNotFound($table, DATADIR . "/" . $db));
            break;
        default:
            showMessage(__FILE__, TAG_ERROR_INTERNAL, msgErrorInternalReturnCode($rc));
            break;
    }
}

// List the fields of special type (e.g. date, geo, link) specified by the user that were found in the user table
if ($datefields !== "" or $geofields !== "" or $linkfields !== "") {
    // Show a message with the fields registered as special-type fields
    echo "<h4>The following fields were registered as fields of special type:</h4>";
    $aFields = dbGetFieldTypes($id);
    if ($aFields == null || count($aFields) == 0) {
        echo "<em>No fields were registered as fields of special type.</em>";
    } else {
        foreach ($aFields as $field => $type) {
            if ($type === "date" || $type === "geo_point" || $type === "url") {
                echo "$type: $field<br>";
            }
        }
    }
    /*	// (2016/07/29) This was commented out because the information of the date fields not found in the user data is no longer returned by dbGetFieldTypes() nor dbCreateTableIndex(). 
// Check if any date fields were not found in the user table and show a message
if (count($aIndex['notfound']) > 0) {
    showMessage("", TAG_WARNING, "The following date fields were not found in table '$table':\n");
    foreach ($aIndex['notfound'] as $field) {
        echo "$field<br>";
    }
}
*/
}