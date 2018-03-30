<?php
/*1:file方式引入函数
composer.json
{
    "require": {
        "guzzlehttp/guzzle": "^6.1"
    },

    "autoload": {
        "classmap": ["classsrc/","classsrc.php"],
                "files": ["filesrc.php"]
    }
}
*/
function filesrc() {
	echo "filesrc";
}


?>
