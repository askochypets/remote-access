<?php
  	echo $_SERVER["REMOTE_ADDR"];
	
	if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
	    file_put_contents('remote_ip.log', date('Y-m-d   H:i:s') . ':   ' . $_SERVER['REMOTE_ADDR'] . PHP_EOL, FILE_APPEND);
	}
?>

