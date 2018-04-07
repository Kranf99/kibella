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

// Read the configuration file to define constants needed for this page (such as CACHEMODE used in views/delete.php)
require_once __DIR__ . '/../../../../src/config.php';
?>
<html>
<head>
<meta charset="utf-8">
<title>Delete cache</title>
</head>
<body>
  <ul class="second">
    <li><a href="../../formDeleteCache.html">Delete Kibella's cache</a></li>
    <li><a href="../../formDeleteCacheOld.html">Delete Kibella's old cache files</a></li>
  </ul>
  <p class="cache-settings">Current cache settings:<br/><?php
    if (strtolower(CACHEMODE) === "day") {
      $cachedaychange = CACHEDAYCHANGE;
      echo "Delete cache files older than $cachedaychange and earlier than ";
    }
    else {
      $cachehours = CACHEHOURS;
      echo "Delete cache files older than $cachehours hours from ";
    }
  ?>
  the current visualization request.</p>
</body>
</html>