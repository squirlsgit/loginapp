<?php
session_start();
if((isset($_SESSION['key']) && $_SESSION['key'] === 'key') || ( isset($_POST['user']) && isset($_POST['pw']) && $_POST['user'] === 'foo' && $_POST['pw'] === 'Foobartimes8!')){echo json_encode(["islog" => true]); exit(); }
else {
  echo json_encode(["islog" => false]);
}
 ?>
