# -*- mode: ruby -*-
# vi: set ft=ruby :

$root = <<SCRIPT
echo 'LC_ALL="en_US.UTF-8"' > /etc/default/locale
apt-get install -y git-core curl libfontconfig1 fontconfig libfontconfig1-dev libfreetype6-dev
SCRIPT

$vagrant = <<SCRIPT
curl https://raw.githubusercontent.com/creationix/nvm/v0.25.1/install.sh | bash
SCRIPT

Vagrant.configure("2") do |config|
	config.vm.network "private_network", ip: "192.168.33.10"

	config.vm.box = "ubuntu/trusty64"

	config.vm.provision "shell", inline: $root
	config.vm.provision "shell", inline: $vagrant, privileged: false

	config.vm.provider "virtualbox" do |web|
		web.memory = 2048
		web.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
	end
end
