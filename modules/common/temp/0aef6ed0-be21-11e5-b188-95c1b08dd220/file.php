<?php
$ho = fopen('php://stdout', "w");

fwrite($ho, "Hello");


fclose($ho);
