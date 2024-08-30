<?php

session_start();

$servername = "localhost";
$db_username = "root";
$db_password = "";
$database_name = "scandiweb";

$conn = mysqli_connect($servername, $db_username, $db_password, $database_name);

if(!$conn){
    die("failed to connected");
} 

$GLOBALS['conn'] = $conn;