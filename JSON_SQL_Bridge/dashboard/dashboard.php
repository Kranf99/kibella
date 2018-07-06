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
require_once(__DIR__ . '/../classes.php');

require_once(__DIR__ . '/../users/user.php');

class Dashboard {

  private $db_connection = null;

  public function isShared($id) {
    $id = addslashes(htmlentities($id, ENT_QUOTES));

    $this->db_connection = dbDBHCreate(KIBELLADB, TABLESDIR, $mode="sqlite");

    $sql = 'SELECT ' . OBJ_COLUMN_SHARED . '
            FROM ' . OBJTABLE . '
            WHERE ' . ALL_COLUMN_ID . ' = "' . $id . '" AND ' . OBJ_COLUMN_TYPE . ' = "' . NAME_DASHBOARD . '"
            LIMIT 1';
    
    $result = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="sqlite");

    return $result[0][OBJ_COLUMN_SHARED];
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

      $sql = 'UPDATE ' . OBJTABLE . '
              SET ' . OBJ_COLUMN_SHARED . ' = "' . $newValue . '"
              WHERE ' . ALL_COLUMN_ID . ' = "' . $id . '" AND ' . OBJ_COLUMN_TYPE . ' = "' . NAME_DASHBOARD . '"
              LIMIT 1';
      
      $result = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="exec");

      return $result;
    }

    return false;
  }
}