# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
	config.vm.box = "http://vagrant.int.unic.com/boxes/unic-local-rt-fe1.int.unic.com.box"

	config.vm.define "web" do |web|
		#web.vm.box = "unic-local-rt-fe1.int.unic.com"
		web.vm.network "private_network", ip: "192.168.33.10"

		#config.vm.synced_folder "./apollo", "/opt/apollo/apollo"

		#config.vm.provision "shell", path: "vagrant_provision.sh"
	end

	config.vm.provider "virtualbox" do |web|
		web.memory = 2048
	end

end
