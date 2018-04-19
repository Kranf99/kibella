<?php
/*
KIBELLA 1.0
Copyright 2016 Frank Vanden berghen
All Right reserved.

Kibella is not a free software. The Kibella software is NOT licensed under the "Apache License". 
If you are interested in distributing, reselling, modifying, contibuting or in general creating 
any derivative work from Kibella, please contact Frank Vanden Berghen at frank@timi.eu.
*/
namespace kibella; class l0 extends \sqlite3 { function __construct($O0) { try { $this->open($O0); } catch ( \exception $l1) { $l1->getmessage(); } } } class O1 extends \thread { private $l2; private $O2; private $l3; public function __construct($l2,$O2=FALSE) { $this->l2 =$l2; $this->O2 =$O2; } public function run() { $O3=l4($this->l2 ,$O2=$this->O2); $this->l3 =$O3["responseFile"]; $this->O4 =TRUE; } public function l5() { return $this->l2; } public function O5() { return $this->O2; } public function l6() { return $this->l3; } }