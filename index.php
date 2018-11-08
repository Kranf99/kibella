<?php
/*
KIBELLA 2.5
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/

namespace kibella;

// Check user authentication
require_once 'JSON_SQL_Bridge/users/user.php';

$user = new User();

if(!$user->isLoggedIn()) {
  header('Location: public/users/login');
  die();
}

require_once "JSON_SQL_Bridge/config.php";
?>
<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <title>Kibella 2.5</title>
  <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="node_modules/animate.css/animate.min.css">
  <link rel="stylesheet" href="public/styles/home.css">
</head>
<body>
  <div class="container animated fadeIn">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <img class="logo" src="interface/images/logo.svg">
        <h1 class="welcome">Welcome to <em>Kibella</em> !</h1>
        <table>
          <tbody>
            <tr>
              <td><i class="fa fa-rocket"></i></td>
              <td><a href="interface">Explore your data</a></td>
            </tr>
            <tr>
              <td><i class="fa fa-cog"></i></td>
              <td><a href="public/admin/users/manage.php">Administration</a></td>
            </tr>
            <tr>
              <td><i class="fa fa-book"></i></td>
              <td><a href="public/KibellaQuickUserGuide.pdf" target="_blank">Documentation</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <form action="JSON_SQL_Bridge/users/actions/logout.php" method="POST">
    <button type="submit" id="logout" name="logout"><i class="fa fa-chevron-left" aria-hidden="true"></i> Logout</button>
  </form>
  <a href="LICENSE.txt" target="_bank" class="license">© Frank Vanden Berghen</a>
</body>
</html>
