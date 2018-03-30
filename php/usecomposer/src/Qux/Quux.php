<?php

namespace  Foo\Bar\Qux ;

const QuxConst = "QuxConst";

function QuxFunction() {
	return "namespace_Qux_function" ;
}
 

class Quux {


	static public function Quux_function() {

		return "Foo\Bar\Qux";
	}

	//global class, function or constant
	public function get_global_data() {

		$data[] = \strlen('hi');
		$data[] = \INI_ALL;
		$data[] = new \Exception('error');
		return $data;

	}
 
}

 