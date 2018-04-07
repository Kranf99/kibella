<?php
namespace kibella;
require_once __DIR__ . '/../src/config.php';
?>
<html>
<!--
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
-->
<head>
<meta charset="utf-8">
<title>Accelerate dashboards</title>
</head>
<body>

<h2>Accelerate all the dashboards created on the given table</h2>
 <form name="document.forms.AccelerateDashboards" action="../src/formAccelerateDashboardsSubmit.php" autocomplete="off" method="POST" novalidate>
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
	<em>Name of the table whose dashboards should be accelerated</em>
	<br>
	<br>
	<input type="submit" value="Accelerate Dashboards"></input>
</form>

</body>
</html>

