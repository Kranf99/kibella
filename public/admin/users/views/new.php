<!--
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
-->
<h1>Create user</h1>

<form action="new.php" method="post" class="new-user">
  <div class="form-group">
    <i class="icon fa fa-user"></i>
    <input type="text" id="firstname" name="firstname" placeholder="First name" class="form-control input" autofocus>
  </div>
  <div class="form-group">
    <i class="icon fa fa-user"></i>
    <input type="text" id="lastname" name="lastname" placeholder="Last name" class="form-control input">
  </div>
  <div class="form-group">
    <i class="icon fa fa-envelope"></i>
    <input type="text" id="email" name="email" placeholder="Email" class="form-control input">
  </div>
  <div class="form-group">
    <i class="icon fa fa-key"></i>
    <input type="password" id="password" name="password" placeholder="Password" class="form-control input">
  </div>
  <div class="form-group">
    <i class="icon fa fa-key"></i>
    <input type="password" id="password_repeat" name="password_repeat" placeholder="Repeat password" class="form-control input">
  </div>
  <div class="form-group" style="margin-top: 30px;">
    <div class="checkbox">
      <label>
        <input type="checkbox" id="is_admin" name="is_admin" value="yes"> Administrator
      </label>
    </div>
  </div>
  <button type="submit" name="register" class="submit-button">Create new user</button>
</form>