<?php
  	echo $_SERVER["REMOTE_ADDR"];
	
	if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['address']) {
	    file_put_contents('remote_ip.log', date('Y-m-d   H:i:s') . ' Local Ip:   ' . $_POST['address'] . PHP_EOL, FILE_APPEND);
	}

	if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
	    file_put_contents('remote_ip.log', date('Y-m-d   H:i:s') . ' External Ip :   ' . $_SERVER['REMOTE_ADDR'] . PHP_EOL, FILE_APPEND);
	}
	
	if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['clear']) {
		file_put_contents('remote_ip.log', '');
	}
?>

