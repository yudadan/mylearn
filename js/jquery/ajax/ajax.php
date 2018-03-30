<?php

$key = $_REQUEST['ty'] ;
$key = ($key ==""?'search':$key ) ;
if ($key == "search") {

	$arr['k1'] = "v1" ;
	$arr['k2'] = "v2" ;
	$arr['k3'] = "v3" ;
	echo json_encode($arr) ;
	exit ;
} else if ($key == "jsonpself") {
	$callback = $_GET['callback'];
	$data = array(1,2,3,4);
	 shuffle($data);
	echo $callback . '(' . json_encode($data) . ');' ;
}else if ($key == "jsonp") {
	$callback = $_GET['callb'];
	$data = array(1,2,3,4);
	shuffle($data);
	echo $callback . '(' . json_encode($data) . ');' ;
}else if ($key=="submit") {
	sleep(3);
	$arr['result'] = "1000" ;
	$arr['msg'] = "ok" ;
	echo json_encode($arr) ;
	exit ;
}