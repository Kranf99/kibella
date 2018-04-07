<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella;
// Read the configuration file to define constants needed for this page (such as DATADIR)

require_once __DIR__ . '/../../../../JSON_SQL_Bridge/configreadinifile.php';
require_once __DIR__ . '/../../../../JSON_SQL_Bridge/users/user.php';
$user = new User();
?>
<html>
<head>
<meta charset="utf-8">
<title>Register table form</title>
</head>
<body>
<?php
  if($user->isAdmin()) {
?>

<h2>Register a new table or update an already registered table</h2>
 <!-- Ref for forms: http://www.w3schools.com/html/html_forms.asp -->
 <form name="document.forms.RegisterTable" action="/kibella/JSON_SQL_Bridge/formRegisterTableSubmit.php" autocomplete="off" method="POST" novalidate>
	<b>Database:</b><span style="font-size:14px"> (case sensitive under Linux server)</span><br>
	<input type="text" name="db"></input><br>
	<?php
	$datadir = DATADIR;
	echo <<<HTML
	<em style="font-size:16px">Name of the SQLite database file where the table is located (Ex: CensusIncome.sqlite)</em><br>
	<em style="font-size:16px">Currently selected database location (in kibella.ini): <b>'$datadir'</b></em>
HTML;
	?>
	<br>
	<br>
	<b>Table:</b><span style="font-size:14px"> (not case sensitive)</span><br>
	<input type="text" name="table"></input><br>
	<em>Name of the table to register</em>
	<br>
	<br>
	<b>Date fields:</b><span style="font-size:14px"> (not case sensitive)</span><br>
	<input type="text" name="datefields" size=75></input><br>
	<em>List any date fields in the table separated by commas (Ex: salesdate, date previous sale, "event date")</em><br>
	<em>(names with spaces may or may not be enclosed in single or double quotes)</em>
	<br>
	<br>
	<b>Geo-coordinate fields:</b><span style="font-size:14px"> (not case sensitive)</span><br>
	<input type="text" name="geofields" size=75></input><br>
	<em>List any geo-coordinate fields separated by commas (Ex: latlon, "latitude longitude")</em><br>
	<em>(names with spaces may or may not be enclosed in single or double quotes)</em>
	<br>
	<br>
	<b>Image fields:</b><span style="font-size:14px"> (not case sensitive)</span><br>
	<input type="text" name="linkfields" size=75></input><br>
	<em>List any fields whose content is the name of an image file to be used as icons in the Discover Tab (separated by commas)</em><br>
	<em>(names with spaces may or may not be enclosed in single or double quotes)</em>
	<br>
	<br>
	<b>Enable the cache for the results run on this table?</b><span style="font-size:14px"></span><br>
	<input type="text" name="enablecache" size=1 value=1></input><br>
	<em>Use 1 to store the results of queries run on this table in the cache; use 0 otherwise.</em>
	<br>
	<br>
	<br>
	<br>
	<input type="submit" value="Create Index"></input>
</form>
<?php 
  } else {
    echo 'You have to be an admin to access this page.';
  }
?>
</body>
</html>