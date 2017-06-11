<?php

session_start();
$_SESSION['key'] = 'notkey';
if($_SESSION['key'] === 'key'){ echo json_encode(["islog" => true]);} else {echo json_encode(["islog" => false]);}
?>
