#!/bin/bash
#EAA-210131
OBJETIVO="Instala gps"
#########################################################################
SCRIPT=$0
function CompruebaRoot {
	soy=`whoami`
	if test "$soy" != "root"
	then
		echo "Ha de ejecutarse como root"
		exit 1
	fi
}
function Inicio {
	Mensaje "INICIO"
}
function Fin {
	Mensaje "FIN"
	exit
}
function Mensaje {
	echo "----> $*"
}
function PulsaTecla {
	Mensaje "Para continuar pulsa cualquier tecla o <ctl-c> para abortar"
	read respuesta
}
Mensaje "$OBJETIVO"
CompruebaRoot
PulsaTecla
Inicio
#########################################################################
usuario="root"
grupo="root"

# Instala ejecutable del servicio
fichero="gps"
[ -f $fichero ] || { Mensaje "No existe fichero: $fichero"; Fin; }
Mensaje "Instala ejecutable: $fichero"	
mkdir -p /usr/local/bin/
install -m 755 -o $usuario -g $grupo $fichero /usr/local/bin/$fichero
touch /var/log/$fichero.log

# Instala servicio
fichero="gps.service"
[ -f $fichero ] || { Mensaje "No existe fichero: $fichero"; Fin; }
Mensaje "Instala el servicio: $fichero"
install -m 644 $fichero /etc/systemd/system/$fichero
Mensaje "Activa el servicio"
systemctl enable $fichero

# Inicia el servicio
Mensaje "Se puede iniciar el servicio manualmente"
Mensaje "systemctl start gps"

Fin
