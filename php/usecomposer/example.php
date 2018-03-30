<?php
require __DIR__ . '/vendor/autoload.php';

//1:classmap
$obj = new myclass ;
//$obj->output();
echo "\n";

//2:files
//filesrc();

//3:本地符合psr4标准的代码
$obj = new \Foo\Bar\Baz;  
print_r($obj->getdata());
