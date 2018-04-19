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

class Session {

  private $db_connection = null;

  public $error = null;

  public function __construct() {
      // create/read session, absolutely necessary
      if(!isset($_SESSION))
        session_start();
      
      if (isset($_POST["logout"])) {
          $this->logout();
      } elseif (isset($_POST["login"])) {
        $this->login();
      }
  }

  private function login() {
    if ($this->checkLoginFormDataNotEmpty()) {
      $this->db_connection = dbDBHCreate(KIBELLADB, TABLESDIR, $mode="sqlite");
      if ($this->db_connection) {
          $this->checkPasswordCorrectnessAndLogin();
      }
    }
  }

  public function logout() {
    $_SESSION = array();
    session_destroy();

    return true;
  }

  private function checkPasswordCorrectnessAndLogin() {
      $sql = 'SELECT id, email, password
              FROM Users
              WHERE email = "' . addslashes(htmlentities($_POST['email'], ENT_QUOTES)) . '"
              LIMIT 1';
      
      $result_row = dbDBHExecuteSqlQuery($this->db_connection, $sql, $mode="sqlite");
      if ($result_row) {
        // using PHP 5.5's password_verify() function to check password
        if ((!strlen($result_row[0]['password']))||(password_verify($_POST['password'], $result_row[0]['password']))) {
          // write user data into PHP SESSION [a file on your server]
          //$_SESSION['user_name'] = $result_row->user_name;
          $_SESSION['id'] = $result_row[0]['id'];
          $_SESSION['user_is_logged_in'] = true;
          // $this->user_is_logged_in = true;
          // return true;
          header('Location: ../../..');
          die();
        } else {
            $this->error = "Wrong password.";
        }
      } else {
          $this->error = "This user does not exist.";
      }
      
      return false;
  }

  private function checkLoginFormDataNotEmpty() {
//      if (!empty($_POST['email']) && !empty($_POST['password'])) {
//          return true;
//      } else
      if (empty($_POST['email'])) {
          $this->error = "Email field was empty.";
          return false;
      }
//      elseif (empty($_POST['password'])) {
//          $this->error = "Password field was empty.";
//      }
      
      return true;
  }
}