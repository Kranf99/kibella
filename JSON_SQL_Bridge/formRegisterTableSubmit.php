<?php
/*
JSON_SQL_Bridge 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

JSON_SQL_Bridge is not a free software. The JSON_SQL_Bridge software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from JSON_SQL_Bridge, please contact Frank Vanden Berghen at frank@timi.eu.
*/
/** Triggers the process to create a table index and register the table with the database where it is stored.
 * The database and table information are taken from the related form.
 * 
 * Following are the parameters that should be received as part of the POST request received from the form: 
 * <ul>
 * <li> db		name of the database where the table is located with no indication of the path (e.g. income.sqlite) 
 * <li> table	name of the table for which the index should be created (e.g. census)
 * </ul> 
 *
 */
namespace kibella;

require_once 'config.php';


/** Returns a string with an internal error message about the TABLESDIR directory.
 *
 * @author: Daniel Mastropietro
 * @since: 29-Jul-2016
 */
function msgErrorInternalTablesDir() {
	return "An internal error occurred.\nCheck existence and permissions of '" . TABLESDIR . "' directory in the web server.\n";
}

/** Returns a string with a note message about table registered successfully.
 *
 * @param string $table			table name.
 * @param string $db			database where the table is stored.
 * @param string $id 			table ID used for registration.
 * @param string $enablecache	flag 0/1 indicating whether the cache is enabled for this table.
 * @return string				note message.
 *
 * @author: Daniel Mastropietro
 * @since: 29-Jul-2016
 */
function msgNoteTableRegistrationAdded($table, $db, $id, $enablecache) {
	$cachemode = $enablecache == 1 ? "ENABLED" : "DISABLED"; 
	return "Table '$table' in database '$db' successfully registered with ID '$id'.\nCache is $cachemode.\n";
}

/** Returns a string with a note message about table registration updated.
 *
 * @param string $table			table name.
 * @param string $db			database where the table is stored.
 * @param string $id 			table ID used for registration.
 * @param string $enablecache	flag 0/1 indicating whether the cache is enabled for this table.
 * @return string				note message.
 *
 * @author: Daniel Mastropietro
 * @since: 29-Jul-2016
 */
function msgNoteTableRegistrationUpdated($table, $db, $id, $enablecache) {
	$cachemode = $enablecache == 1 ? "ENABLED" : "DISABLED"; 
	return "The registration information for table '$table' in database '$db' with ID '$id' has been successfully updated.\nCache is $cachemode.\n";
}

/*------------------------------------- ERROR MESSAGES --------------------------------------*/
// These messages are divided into EXTERNAL errors (triggered by the user, i.e. they could happen depending on the user input --e.g. user leaves the name of the table to register empty)
// and INTERNAL errors (triggered by the application, i.e. they should NOT happen if everything is all right with the application setup --e.g. permissions to write in internal database)
// - All EXTERNAL errors start with "msgErrorExternal" in the function name
// - All INTERNAL errors start with "msgErrorInternal" in the function name
/** Returns a string with an error message about database not found.
 *
 * @param string $db		database name.
 *
 * @author: Daniel Mastropietro
 * @since: 18-Jul-2016
 */
function msgErrorExternalDatabaseNotFound($db) {
	return "Database '$db' does not exist.\nTry again going back to the previous page.\n";
}

/** Returns a string with an error message about table not found in database.
 *
 * @param string $table		table name searched for.
 * @param string $db		database where the table was searched for.
 *
 * @author: Daniel Mastropietro
 * @since: 13-Jun-2016
 */
function msgErrorExternalTableNotFound($table, $db) {
	if ($table == "") {
		return "Please specify a table name.\nTry again going back to the previous page.\n";
	}
	else if ($db == "") {
		return "Please specify the database where the table '$table' resides.\nTry again going back to the previous page.\n";
	}
	else
		return "Table '$table' was not found in database '$db'.\nTry again going back to the previous page.\n";
}
/** Returns a string with an internal error message about return codes.
 *
 * @return rc	invalid return code to show in the error message.
 *
 * @author: Daniel Mastropietro
 * @since: 29-Jul-2016
 */
function msgErrorInternalReturnCode($rc) {
	return "Unknown return code ($rc).\n";
}

/*-------------------------- GET DATA FROM THE FORM ---------------------------*/
$table = $_POST['table'];
$db = $_POST['db'];
$dbengine_name = "sqlite";                        // In the future this attribute would be read from the form 
//$dbengine_name = $_POST['dbtype'];
$datefields = $_POST['datefields'];		// This is expected to be a list of date fields separated by commas
$geofields = $_POST['geofields'];		// This is expected to be a list of geo-coordinate fields separated by commas
$linkfields = $_POST['linkfields'];		// This is expected to be a list of link fields separated by commas
$enablecache = 1; // $_POST['enablecache'];	// Flag 0/1 indicating whether to enable the cache for the table

// Assertions on the above values
//dbAssertValidDBEngine($dbengine_name);
//$dbengine_code = convertDBEngineNameToDBEngineCode($dbengine_name);

// Store the above values in an array
$aTableInfoFromUser = array(	'table' 		=> $table,
								'db' 			=> $db,
								'dbengine' 		=> $dbengine_name,
								'datefields' 	=> $datefields,
								'geofields' 	=> $geofields,
								'linkfields' 	=> $linkfields,
								'enablecache'	=> $enablecache
							);
/*-------------------------- GET DATA FROM THE FORM ---------------------------*/


/*---------------------------- REGISTER THE TABLE -----------------------------*/
// Save the table information in Kibella's database 
$aResult = dbRegisterTable($aTableInfoFromUser);
if ($aResult !== FALSE) {
	$id = $aResult['id'];	// Table ID
	$rc = $aResult['rc'];	// Return code
	
	// Check the return code and show a message accordingly
	if ($rc === FALSE) {
		showMessage(__FILE__, TAG_ERROR_INTERNAL, msgErrorInternalTablesDir());
	}
	else {
		switch ($rc) {
			case (RC_NOTE_TABLE_ADDED):
				showMessage("", TAG_NOTE, msgNoteTableRegistrationAdded($table, $db, $id, $enablecache));
				break;
			case (RC_NOTE_TABLE_UPDATED):
				showMessage("", TAG_NOTE, msgNoteTableRegistrationUpdated($table, $db, $id, $enablecache));
				break;
			case (RC_ERROR_NOTFOUND_DB):
				$dbWithFullPath = $db;
//				if (isEmbeddedDatabase($dbengine_code)) {
					$dbWithFullPath = DATADIR . "/$db";
//				}
				showMessage("", TAG_ERROR, msgErrorExternalDatabaseNotFound($dbWithFullPath));
				break;
			case (RC_ERROR_NOTFOUND_TABLE):
				$dbWithFullPath = $db;
//				if (isEmbeddedDatabase($dbengine_code)) {
					$dbWithFullPath = DATADIR . "/$db";
//				}
				showMessage("", TAG_ERROR, msgErrorExternalTableNotFound($table, $dbWithFullPath));
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
		}
		else {
			foreach ($aFields as $field => $type) {
				if ($type === "date" || $type === "geo_point" || $type === "url") {
					echo "$type: $field<br>";
				}
			}
		}
		/*	// (2016/07/29) This was commented out because the information of the fields not found in the user data is no longer returned by dbGetFieldTypes().
		 // Check if any date fields were not found in the user table and show a message
		 if (count($aIndex['notfound']) > 0) {
			showMessage("", TAG_WARNING, "The following date fields were not found in table '$table':\n");
			foreach ($aIndex['notfound'] as $field) {
			echo "$field<br>";
			}
			}
			*/
	}	
}
/*---------------------------- REGISTER THE TABLE -----------------------------*/

//echo "<pre><button type=\"button\" onclick=\"history.go(-1);\">Go back to previous page</button></pre>";
