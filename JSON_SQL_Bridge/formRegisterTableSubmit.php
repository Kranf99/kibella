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

/**
   -------------------------- Start Copy/Paste from various other .php files: ---------------------------
**/

const RC_ERROR_NOTFOUND_DB = -2;
const RC_ERROR_NOTFOUND_TABLE = -3;
const ALL_COLUMN_ID = "_id";
const ALL_COLUMN_VERSION = "_version";
const IDX_COLUMN_TABLE = "tablename";
const IDX_COLUMN_DB = "db";
const IDX_COLUMN_DBTYPE = "dbtype";
const IDX_COLUMN_DATEFIELDS = "datefields";
const IDX_COLUMN_GEOFIELDS = "geofields";
const IDX_COLUMN_LINKFIELDS = "linkfields";
const IDX_COLUMN_ENABLECACHE = "enablecache";
const TAG_NOTE = "NOTE";
const TAG_ERROR_INTERNAL = "INTERNAL ERROR"; 
const RC_NOTE_TABLE_ADDED = 0;
const RC_NOTE_TABLE_UPDATED = 1;

function showMessage($location, $type, $msg) {
	if ($location !== "")
		$location = "($location) ";
	echo "<pre>" . strtoupper($type) . ": $location $msg</pre>";
}

function msgNoteTableRegistrationAdded($table, $db, $id, $enablecache) {
	$cachemode = $enablecache == 1 ? "ENABLED" : "DISABLED"; 
	return "Table '$table' in database '$db' successfully registered with ID '$id'.\nCache is $cachemode.\n";
}

function msgNoteTableRegistrationUpdated($table, $db, $id, $enablecache) {
	$cachemode = $enablecache == 1 ? "ENABLED" : "DISABLED"; 
	return "The registration information for table '$table' in database '$db' with ID '$id' has been successfully updated.\nCache is $cachemode.\n";
}

function msgErrorInternalTablesDir() {
	return "An internal error occurred.\nCheck existence and permissions of '" . TABLESDIR . "' directory in the web server.\n";
}

function checkDirExistsOrCreate($dir, $permissions=0744, $recursive=true, $log=false, $message="") {
	$rc = true;
	if (!is_dir($dir)) {
		if ($log) showMessage("", TAG_WARNING, $message);
		$rc = mkdir($dir, $permissions, $recursive);
	}
	return $rc;
}

function dbCheckInternalDatabaseAndReset($table, $log=false) {
	if ($log) {
		$content = "registered tables";
	}

	$rc = checkDirExistsOrCreate(TABLESDIR, $log=$log, $message="The temporary directory with the application's information '" . TABLESDIR . "' was not found and is being recreated.\n");
	if ($rc === FALSE) {
		showMessage(__FUNCTION__, TAG_ERROR, msgErrorInternalTablesDirCouldNotCreate() . msgNoteCheckUserPermissions());
		return false;
	}

	$rc = dbCheckTableExists($table, KIBELLADB, TABLESDIR);
	if ($rc === RC_ERROR_NOTFOUND_DB) {
		if ($log) showMessage("", TAG_WARNING, "Internal database storing the application's information was not found and is being recreated.\n");
		$rc = dbResetInternalDatabase($log=false);
	}
	else if ($rc === RC_ERROR_NOTFOUND_TABLE) {
		if ($log) showMessage("", TAG_WARNING, "The internal table storing the $content was not found and is being recreated.\n");
		$dbh = dbDBHCreate(KIBELLADB, $dir=TABLESDIR, $mode="sqlite");
		$rc = dbResetInternalTable($dbh, $table, false);
		$dbh->close();
		unset($dbh);
	}
	return $rc;
}

function dbGenerateTableId($table, $db) {
	return strtoupper(strstr($db, ".", true)) . "(" . strtolower($table) . ")";
}

function dbExecuteSqlQuery($sqlquery, $db, $dir, $mode="query", $dbtype="sqlite", $aParams=null) {
	$result = false;
	$dbfile = "$dir/$db";
	try {
		$pdo = new \PDO("$dbtype:$dbfile");
		if ($mode == "exec") {
			try {
				if ($aParams != null) {
					$pdoStmt = @$pdo->prepare($sqlquery);
					foreach ($aParams as $param => $value) {
						$pdoStmt->bindValue($param, $value);
					}
					$result = $pdoStmt->execute();	
					unset($pdoStmt);
				}
				else {
					$result = @$pdo->exec($sqlquery);
				}
			} catch (\PDOException $e) {
			}
		}
		else {
			$pdoStmt = @$pdo->query($sqlquery);
			if ($pdoStmt) {
				$result = $pdoStmt->fetchAll(\PDO::FETCH_ASSOC);
			}
			unset($pdoStmt);
		}
		unset($pdo);
	} catch (\PDOException $e) {
		showMessage(__FUNCTION__, TAG_ERROR_INTERNAL, $e->getMessage() . " " . $dbfile . "\n");
	}
	return $result;
}

function dbCheckTableExists($table, $db, $dir) {
	if (!file_exists("$dir/$db")) {
		return RC_ERROR_NOTFOUND_DB;
	}
	$aResult = dbExecuteSqlQuery("select * from sqlite_master where type = 'table' and lower(name) = lower('$table')", $db, $dir);
	if ($aResult === FALSE) {
		return false;
	}
	if (count($aResult) == 0) {
		return RC_ERROR_NOTFOUND_TABLE;
	}
	return true;
}

function dbRegisterTable($aTableInfo) {
	$tuser = new User();
	if (PHP_SAPI !== "cli" && !$tuser->isLoggedIn())
    	return false;
	extract($aTableInfo);
	if ($db == "") {
		showMessage("", "note", msgErrorExternalEnterAValue("Database"));
	}
	if ($table == "") {
		showMessage("", "note", msgErrorExternalEnterAValue("Table"));
	}
	if ($db == "" || $table == "") {
		return false;
	}
	assert($dbtype != "", "The database type is not empty.");
	$rc = dbCheckTableExists($table, $db, DATADIR);
	if ($rc === FALSE || $rc < 0) {
		$id = "";
	}
	else {
		$rc = false;
		$db = basename(realpath(DATADIR . "/$db"));
		$id = dbGenerateTableId($table, $db);
		$rc = dbCheckInternalDatabaseAndReset("RegisteredTables", $log=true);
		if ($rc === FALSE) {
			return array('id' => $id, 'rc' => false);
		}
		$rc = false;

		$aResult = dbExecuteSqlQuery("select " . ALL_COLUMN_VERSION .
									 " from RegisteredTables where lower(" . ALL_COLUMN_ID . ") = '" . strtolower($id) . "'",
									 KIBELLADB, TABLESDIR, $mode="query", $dbtype="sqlite");
		if ($aResult === FALSE ) {
			$rc = false;
		}
		else if (count($aResult) == 0) {
			$version = 1;
			$result = dbExecuteSqlQuery("insert into RegisteredTables (" .
																				ALL_COLUMN_ID 			. "," .
																				IDX_COLUMN_TABLE 		. "," .
																				IDX_COLUMN_DB 			. "," .
																				IDX_COLUMN_DBTYPE 		. "," .
																				ALL_COLUMN_VERSION 		. "," .
																				IDX_COLUMN_DATEFIELDS	. "," .
																				IDX_COLUMN_GEOFIELDS	. "," .
																				IDX_COLUMN_LINKFIELDS	. "," .
																				IDX_COLUMN_ENABLECACHE	.
																	")" .
					 												" values(	'$id',
																				'$table',
																				'$db',
																				'$dbtype',
																				 $version,
																				'$datefields',
																				'$geofields',
																				'$linkfields',
																				'$enablecache'
																			)",
										KIBELLADB, TABLESDIR, $mode="exec", $dbtype="sqlite");
			if ($result !== FALSE) $rc = RC_NOTE_TABLE_ADDED;
		}
		else {
			$version = $aResult[0][ALL_COLUMN_VERSION] + 1;
			$result = dbExecuteSqlQuery("update RegisteredTables set " .
																		IDX_COLUMN_TABLE 		. " = '$table', " .
																		IDX_COLUMN_DB 			. " = '$db', " .
																		IDX_COLUMN_DBTYPE 		. " = '$dbtype', " .
																		ALL_COLUMN_VERSION 		. " =  $version, " .
																		IDX_COLUMN_DATEFIELDS	. " = '$datefields', " .
																		IDX_COLUMN_GEOFIELDS	. " = '$geofields', " .
																		IDX_COLUMN_LINKFIELDS	. " = '$linkfields', " .
																		IDX_COLUMN_ENABLECACHE	. " = $enablecache" .
																" where lower(" . ALL_COLUMN_ID . ") = '" . strtolower($id) . "'",
										KIBELLADB, TABLESDIR, $mode="exec", $dbtype="sqlite");
			if ($result !== FALSE) $rc = RC_NOTE_TABLE_UPDATED;
		}
	}
	return array('id' => $id, 'rc' => $rc);
}

/**
   -------------------------- End Copy/Paste from various other .php files ---------------------------
**/

/*-------------------------- GET DATA FROM THE FORM ---------------------------*/
$table = $_POST['table'];
$db = $_POST['db'];	
$dbtype = "sqlite";						// In the future this attribute would be read from the form 
$datefields = $_POST['datefields'];		// This is expected to be a list of date fields separated by commas
$geofields = $_POST['geofields'];		// This is expected to be a list of geo-coordinate fields separated by commas
$linkfields = $_POST['linkfields'];		// This is expected to be a list of link fields separated by commas
$enablecache = $_POST['enablecache'];	// Flag 0/1 indicating whether to enable the cache for the table
$aTableInfo = array(	'table' 		=> $table,
						'db' 			=> $db,
						'dbtype' 		=> $dbtype,
						'datefields' 	=> $datefields,
						'geofields' 	=> $geofields,
						'linkfields' 	=> $linkfields,
						'enablecache'	=> $enablecache
					);
/*-------------------------- GET DATA FROM THE FORM ---------------------------*/


/*---------------------------- REGISTER THE TABLE -----------------------------*/
// Save the table information in Kibella's database 
$aResult = dbRegisterTable($aTableInfo);
if ($aResult !== FALSE) {
	$id = $aResult['id'];	// Table ID
	$rc = $aResult['rc'];	// Return code
	
	// Check the return code and show a message accordingly
	if ($rc === FALSE) {
		showMessage(__FILE__, TAG_ERROR_INTERNAL, 	msgErrorInternalTablesDir());
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
				showMessage("", TAG_ERROR, msgErrorExternalDatabaseNotFound(DATADIR . "/" . $db));
				break;
			case (RC_ERROR_NOTFOUND_TABLE):
				showMessage("", TAG_ERROR, msgErrorExternalTableNotFound($table, DATADIR . "/" . $db));
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

echo "<pre><button type=\"button\" onclick=\"history.go(-1);\">Go back to previous page</button></pre>";
