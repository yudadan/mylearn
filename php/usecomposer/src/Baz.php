<?php

namespace  Foo\Bar ;

const BarConst = "QuxConst";

function BarFunction() {
	return "namespace_Bar_function" ;
}
 

class Baz {


	public function getdata() {

		 $arr['Quxclassfunction'] =  Qux\Quux::Quux_function();
		 $arr['Quxconst'] = Qux\QuxConst;
		 $arr['Quxfunction'] = Qux\QuxFunction();

		 $arr['classfunction'] =  BarFunction();
		 $arr['const'] = BarConst;

		 return $arr ;
	}
}