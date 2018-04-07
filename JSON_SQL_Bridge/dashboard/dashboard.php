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

require_once(__DIR__ . '/../constants.php');
require_once(__DIR__ . '/../functionsdb.php');
require_once(__DIR__ . '/../SQLite3Ext.php');

require_once(__DIR__ . '/../users/user.php');

class Dashboard {

  private $db_connection = null;

  public function isShared($id) {
    $id = addslashes(htmlentities($id, ENT_QUOTES));

    $this->db_connection = dbDBHCreate(KIBELLADB, TABLESDIR, $mode="sqlite");

    $sql = 'SELECT _shared
            FROM Visualizations
            WHERE _id = "' . $id . '" AND _type = "dashboard"
            LIMIT 1';
    
    $result = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="sqlite");

    return $result[0]['_shared'];
  }

  public function changeShared($id, $newValue) {
    $tuser = new User();
    
    if($tuser->isLoggedIn() && is_bool($newValue)) {
      $id = addslashes(htmlentities($id, ENT_QUOTES));

      if($newValue)
        $newValue = 1;
      else
        $newValue = 0;

      $this->db_connection = dbDBHCreate(KIBELLADB, TABLESDIR, $mode="sqlite");

      $sql = 'UPDATE Visualizations
              SET _shared = "' . $newValue . '"
              WHERE _id = "' . $id . '" AND _type = "dashboard"
              LIMIT 1';
      
      $result = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="exec");

      return $result;
    }

    return false;
  }
}