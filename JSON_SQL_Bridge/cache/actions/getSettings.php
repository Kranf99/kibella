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

if (strtolower(CACHEMODE) === CACHEMODE_DAY) {
  $cachedaychange = CACHEDAYCHANGE;
  echo "Delete cache files older than $cachedaychange and earlier than ";
} else {
  $cachehours = CACHEHOURS;
  echo "Delete cache files older than $cachehours hours from ";
}