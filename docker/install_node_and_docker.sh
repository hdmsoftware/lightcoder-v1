
#!/bin/sh

#######################################################################################
# Install docker
#######################################################################################
apt-get update
echo deb http://get.docker.com/ubuntu docker main > /etc/apt/sources.list.d/docker.list
apt-key adv --keyserver pgp.mit.edu --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
apt-get update
apt-get install -y lxc-docker
# Link and fix paths with the following two commands:
ln -sf /usr/bin/docker.io /usr/local/bin/docker
sed -i '$acomplete -F _docker docker' /etc/bash_completion.d/docker.io
service docker start
#######################################################################################
echo "Docker Setup done"
#######################################################################################

#######################################################################################
# Install node.js and mongodb
#######################################################################################
apt-get update
apt-get install nodejs
apt-get install nodejs-legacy
apt-get install npm

apt-get install mongodb-server
#######################################################################################
echo "NodeJS setup completed"
#######################################################################################

#######################################################################################
# Docker start - give permissions to execution script
#######################################################################################

chmod 777 ../modules/common/dockertimeout.sh
chmod 777 ../modules/common/bashscripts/script.sh
chmod 777 ../modules/common/bashscripts/javaRunner.sh
chmod 777 create_container.sh

./create_container.sh 
#######################################################################################
