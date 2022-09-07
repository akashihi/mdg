# Moi.Den.Gi

A personal cloud-style accounting application. [![MDG CI](https://github.com/akashihi/mdg/actions/workflows/mdg.yaml/badge.svg?branch=master)](https://github.com/akashihi/mdg/actions/workflows/mdg.yaml)

This application solves two issues, which are already solved in other existing personal accounting apps separately: desktop applications are truly personal, but you can access them only from your desktop, where they are running. Cloud based personal accounting solutions are available from anywhere, but using it you practically share your financional state and history with service owners. 

MDG (acronym of Moi.Den.Gi, that means "my money" in Russian) is a truly personal tool that can be deployed anywhere on your personal server (in the internet) and will be available from any point, from which that server is accesible, so making it cloud like.

## Contents

- [Deployment](#deployment)
  - [Appliance](#mdg-appliance)
  - [Ansible](#automatic-deploy-with-ansible-on-atomic-host)
  - [Docker compose](#docker-compose)
  - [From source](#deploy-from-source-codes)
- [Usage](#usage)
- [Development](#development)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)

## Deployment

### MDG appliance

This is a recommended way to deploy MDG for actual use. VM image contains Atomic OS image with MDG preinstalled and backup system preconfigured.

Appliances are available since version 0.5.0 and are built for each release. If you would like to use development versions, you have to manually [deploy with ansible](#automatic-deploy-with-ansible-on-atomic-host)

#### Deployment guide

Just grab the VM package from [github](https://github.com/akashihi/mdg/releases/download/v0.6.0/MDG-appliance-v0.6.0.ova.bz2)  and import it
into you virtualization system as a new VM. Boot up the VM and try to access MDG in VM's port 80. Default VM credentials for _remote_ access are `mdg/mdg`. 
Console access is passwordless.

#### Database backup

Appliance is shipped with preconfigured backup service with timer set to 21:21 local time, that will make a full dump of your MDG database and publish it for Duplicati backup. 

Duplicati web interface is available at http://VM.ip:8200/ and needs to be configured manually, to backup that database dump file somewhere else. Backup file will be available under '/source/dump_mdg.sql' file in the Duplicati container.

#### Database restore

MDG database can be restored from the dump by running following commands:

    /opt/mdg.docker-compose -f /opt/mdg/docker-compose.yml stop mdg
    podman run -i --rm --network mdg_backend --link mdg-postgres-1:postgres -ePGPASSWORD=mdg postgres:14.3 psql -h postgres -U mdg -d postgres < dump_mdg.sql
    systemctl restart mdg

It is your duty to upload MDG database dump to the system.

#### Upgrade procedure

To upgrade your MDG appliance make a [backup](#database-backup), move it out of the VM, delete VM, [redeploy](#mdg-appliance)
with the new image and [restore database](#database-restore)

#### Building appliance from scratch

Appliance is based on the [CoreOS](https://getfedora.org/en/coreos?stream=stable) distribution,a minimal operating system for running containerized workloads.
VM for Appliance is a 1 CPU/4GB virtual machine with 20GB of available space. The minimum requirement is about 10GB of disk space, rest is used for your data.

Appliance is configured with Butane script at `mdg.bu`, which can be adjusted to meet your need. That script downloads MDG files, configures execution
environment and prepares the appliance. Script needs to be converted to the Ignition file using [Butane tool](https://docs.fedoraproject.org/en-US/fedora-coreos/producing-ign/):

```shell
butane --pretty --strict mdg.bu > mdg.ign
```

Having ingition file ready, download latest CoreOS [OVA image](https://getfedora.org/en/coreos/download?tab=metal_virtualized&stream=stable&arch=x86_64) for Virtual box,
import it and [apply the configuration](https://docs.fedoraproject.org/en-US/fedora-coreos/provisioning-virtualbox/)

```shell
VBoxManage import --vsys 0 --vmname "MDG" --cpus 1 --memory 1G fedora-coreos-36.20220618.3.1-virtualbox.x86_64.ova
VBoxManage modifymedium disk /path/to/disk.vdi --resize 20G
VBoxManage guestproperty set MDG /Ignition/Config "$(cat mdg.ign)"
```

### Docker compose
Another way of deployment is via [docker compose](https://docs.docker.com/compose/). 

You need to install docker engine and docker compose before deployment, using appropriate procedure for your operating system.

The version is configured by `.env` file specifying two tags:

```shell
MDG_TAG=master
UI_TAG=master
```

You'll need to create that file and after that you have to download docker compose descriptor and start MDG:

    wget https://github.com/akashihi/mdg/raw/master/docker-compose.yml
    sudo docker-compose  up
MDG should start in several seconds, depending on your hardware and internet connection and web interface will be available at http://yourip/

### Deploy from source code

Deployment from the source code is the most complex, but may be useful in case you do not like docker or would like to improve MDG. 

#### Prerequisites

Building:

* [Java 17](https://jdk.java.net/)
* [NPM version 8](https://www.npmjs.com/)

Other (and newer) versions should work too.

Deployment:

* [PostgreSQL 14.x](https://www.postgresql.org/)
* [ElasticSearch 7.x](https://www.elastic.co/downloads/elasticsearch)
* [Nginx](https://www.nginx.com/)

#### Getting source code

MDG consists of java based backend application and React frontend, with source code in a single repository at Github:

    git clone https://github.com/akashihi/mdg.git

#### Building

To build MDG backend you'll have to use bundled Maven:

    cd mdg/backend
    mvnw clean package spring-boot:repackage

This will produce file `target/mdg.jar`.

The web ui requires one more step:

    cd mdg/frontend
    npm install
    npm run build

This will produce a `dist.tar.gz` archive.

#### Environment preparation

Start postgresql and create a database owned by some user. By default database `mdg` with user `mdg` and password `mdg` is expected. You can
adjust database credentials in the `application-local.properties` file. 

Put provided hunspell dictionaries to the elastic configuration directory, then start elastic.
Configure nginx to serve web ui files and proxy mdg server. Sample server configuration is below:

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   /opt/mdg-web-ui;
            index  index.html index.htm;
        }

        location /api {
             proxy_pass http://localhost:8080/;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
             proxy_set_header X-Forwarded-Port $server_port;
        }

        error_page 404 =200 /index.html;
    }

#### Starting MDG

* You can run `mdg.jar` as usual with `java -jar mdg.jar`. This will start server and create database structure.
* Unpack web ui archive with `tar zxvf dist.tar.gz` to the path, specified in nginx config (`/opt/mdg-web/ui` for example) and start nginx.

Check that everything works by accessing web user interface.

## Usage

TBD

## Development

We are using GitHub flow for development.

TBD

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/akashihi/mdg/tags). 

## Authors

* **Denis Chaplygin** - *Initial work* - [akashihi](https://github.com/akashihi)

## License

This project is licensed under the GPLv3 License - see the LICENSE file for details.
