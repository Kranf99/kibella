<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kibella 2.5 - Sign in</title>
  <link rel="stylesheet" href="styles/style.css">
  <link rel="stylesheet" href="../../styles/form.css">
  <link rel="stylesheet" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="../../bower_components/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="../../bower_components/animate.css/animate.min.css">
</head>
<body>
  <div class="container">
    <div class="row animated fadeIn">
      <div class="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <div class="row">
          <div class="col-md-12">
            <img src="./../../../interface/images/logo.svg" class="logo">
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <p class="message">You must sign in to access to the <em>Kibella</em> application.</p>
            <?php
              if($session->error) {
                echo '<p class="error">' . $session->error . '</p>';
              }
            ?>
            <form action="index.php" method="POST">
              <div class="form-group">
                <i class="icon fa fa-user"></i>
                <input type="text" id="email" name="email" placeholder="Email" class="form-control input" autofocus>
              </div>
              <div class="form-group">
                <i class="icon fa fa-key"></i>
                <input type="password" id="password" name="password" placeholder="Password" class="form-control input">
              </div>
              <button type="submit" name="login" class="submit-button">Sign in</button>
            <p class="message"><small>(The Default Login is "admin@kibella.fr" with an empty password)</small></br></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>