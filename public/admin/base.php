<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kibella 2.5 - Admin</title>
  <link rel="stylesheet" href="../styles/style.css">
  <link rel="stylesheet" href="../../styles/form.css">
  <link rel="stylesheet" href="../../../node_modules/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="../../../node_modules/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="../../../node_modules/animate.css/animate.min.css">
</head>
<body>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
        <nav>
          <div class="logo"></div>
          
          <ul>
            <li class="<?php if($page == 'users_manage'){ echo 'active'; } ?>"><a href="../users/manage.php"><i class="fa fa-users"></i> Manage Users</a></li>
            <li class="<?php if($page == 'users_new'){ echo 'active'; } ?>"><a href="../users/new.php"><i class="fa fa-user-plus"></i> Create User</a></li>
          </ul>

          <ul>
            <li class="<?php if($page == 'tables_new'){ echo 'active'; } ?>"><a href="../tables/new.php"><i class="fa fa-table"></i> Register Table</a></li>
          </ul>

          <ul>
            <li class="<?php if($page == 'caches_delete'){ echo 'active'; } ?>"><a href="../caches/delete.php"><i class="fa fa-archive"></i> Delete Cache</a></li>
          </ul>

          <ul class="bottom">
            <li><a href="./../../.."><i class="fa fa-home"></i> Home</a></li>
          </ul>
        </nav>
        <div class="content animated fadeIn">
          <?php
            if($user_manager->error) {
              echo '<p class="admin-error">' . $user_manager->error . '</p>';
            } else if($user_manager->success) {
              echo '<p class="admin-success">' . $user_manager->success . '</p>';
            }
          ?>

          <?php include($content) ?>
        </div>
      </div>
    </div>
  </div>
</body>
</html>