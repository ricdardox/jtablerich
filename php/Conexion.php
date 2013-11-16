<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Conexion
 *
 * @author ricardo
 */
class Conexion {

    private $_Host;
    private $_Port;
    private $_Dbname;
    private $_Password;
    private $_User;
    private $_Connect;

    function __construct() {
        $this->_Host = "localhost";
        $this->_Port = "5432";
        $this->_Dbname = "geodeals";
        $this->_Password = "123456";
        $this->_User = "admingeodeals";
        $this->_Connect = NULL;
    }

    public function get_Host() {
        return $this->_Host;
    }

    public function set_Host($_Host) {
        $this->_Host = $_Host;
    }

    public function get_Port() {
        return $this->_Port;
    }

    public function set_Port($_Port) {
        $this->_Port = $_Port;
    }

    public function get_Dbname() {
        return $this->_Dbname;
    }

    public function set_Dbname($_Dbname) {
        $this->_Dbname = $_Dbname;
    }

    public function get_Password() {
        return $this->_Password;
    }

    public function set_Password($_Password) {
        $this->_Password = $_Password;
    }

    public function get_User() {
        return $this->_User;
    }

    public function set_User($_User) {
        $this->_User = $_User;
    }

    public function get_Connect() {
        return $this->_Connect;
    }

    public function set_Connect($_Connect) {
        $this->_Connect = $_Connect;
    }

    private function conectarDb() {
        $this->_Connect = pg_connect("host=$this->_Host port=$this->_Port dbname=$this->_Dbname password=$this->_Password user=$this->_User") or die("<div class='error' align=center >Error al conectar con la BD!</div>");
    }

    private function desconectarDb() {
        pg_close($this->_Connect = NULL);
    }

    public function ejecutarSentencia($sentencia) {
        $this->conectarDb();
        if ($this->_Connect != NULL) {
            $salida = pg_query($this->_Connect, $sentencia) or die("<div class='alerta mensaje' align=center >Estamos en mantenimiento.</div>");
            if ($salida) {
                $this->desconectarDb();
                return $salida;
            } else {
                return NULL;
            }
        }
    }

}

?>
