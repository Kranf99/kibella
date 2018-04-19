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

require_once(__DIR__ . '/../constants.php');
require_once(__DIR__ . '/../functionsdb.php');
require_once(__DIR__ . '/../classes.php');

class User {

  private $db_connection = null;

  public function me() {
    if($this->isLoggedIn()) {
      $id = addslashes(htmlentities($_SESSION['id'], ENT_QUOTES));

      $this->db_connection = dbDBHCreate(KIBELLADB, TABLESDIR, $mode="sqlite");

      $sql = 'SELECT firstname, lastname, email
              FROM Users
              WHERE id = "' . $id . '"
              LIMIT 1';
      
      $result = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="sqlite");

      if(isset($result[0]))
        return $result[0];
    }

    return false;
  }

  public function isLoggedIn() {
    if(!isset($_SESSION))
      session_start();

    if(isset($_SESSION['id']) && isset($_SESSION['user_is_logged_in']) && $_SESSION['user_is_logged_in']) {
      return true;
    }

    return false;
  }

  public function isAdmin() {
    if($this->isLoggedIn()) {
      $id = addslashes(htmlentities($_SESSION['id'], ENT_QUOTES));

      $this->db_connection = dbDBHCreate(KIBELLADB, TABLESDIR, $mode="sqlite");

      $sql = 'SELECT is_admin
              FROM Users
              WHERE id = "' . $id . '"
              LIMIT 1';
      
      $result = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="sqlite");

      if($result[0]['is_admin'] == "TRUE")
        return true;
    }

    return false;
  }
}