# Moi.Den.Gi

A personal cloud-style accounting application. [![Build Status](https://travis-ci.org/akashihi/mdg.svg?branch=master)](https://travis-ci.org/akashihi/mdg)

This application solves two issues, which are already solved in other existing personal accounting apps separately: desktop applications are truly personal, but you can access them only from your desktop, where they are running. Cloud based personal accounting solutions are available from anywhere, but using it you practically share your financional state and history with service owners. 

MDG (acronim of Moi.Den.Gi, that means "my money" in Russian) is a truly personal tool that can be deployed anywhere on your personal server (in the internet) and will be available from any point, from which that server is accesible, so making it cloud like.

## Deployment

### Automatic deploy with Ansible on Atomic host

This is a recommended way to deploy MDG for actual use. Provided ansible playbook will deploy docker compose, run MDG and related services in docker containers, configure systemd services for automated start-up and, finally, configure [Duplicati](https://www.duplicati.com/) based backup solution for your data.

#### Prerequisites

* [Atomic linux host](https://www.projectatomic.io/)
* [Ansible](https://www.ansible.com)

#### Deployment guide

1) Get a copy of recent mdg deploy, by either downloading or cloning it:
    
    wget -O mdg-deploy.zip https://github.com/akashihi/mdg-deploy/archive/
    unzip mdg-deploy.zip

    git clone https://github.com/akashihi/mdg-deploy.git
2) Configure your inverntory file: You need to set ip address to your host (default value is 192.168.1.253) and configure ssh access settings, if needed. Consult [Ansible manual](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html) for details.

    vi mdg-deploy/atomic/inventory

3) Choose version, you would like to deploy, by editing playbook file:
    
    vi mdg-deploy/atomic/mdg.yml

You need to edit a 'flavor' variable, setting it either to next(default), deploying a latest dev build ofr MDG, or to 'docker-compose', to deploy latest "stable" version.

4) You can start your deployment now, by calling ansible:

    cd mdg-deploy/atomic
    ansible-playbook -i inventory mdg.yml -k

5) After successfull Ansible run you should check that mdg is available at http://yourip/

#### Upgrade procedure

To upgrade your MDG, deployed with ansible, you have to login to your Atomic host and issue following commands:

    /usr/local/bin/docker-compose -f /usr/local/etc/{next,docker-compose}.yml pull
    systemctl restart mdg

Those two commands will pull new Docker images for MDG and restart the whole software stack.

#### Database backup

Ansible playbook will preconfigure backup service with timer, set to 21:21 local time, that will make a full dump of your MDG database and plublish it for Duplicati backup. 

Duplicati web interface is available at http://yourip:8200/ and needs to be configured manually, to backup that database dump file somewhere else. Backup file will be available under '/srv/dump_mdg.sql' file in the Duplicati container.

#### Database restore

MDG database can be restored from dump by running following command:

    docker run -i --rm --link postgres_1:postgres postgres psql -h postgres -U postgres < dump_mdg.sql

Postgres container name may differ on your system.

### Docker compose
Another way of deployment is via [docker compose](https://docs.docker.com/compose/). 

You need to install docker engine and docker compose before deployment, using appropriate procedure for your operating system. After that you have to download docker compose descriptor and start MDG:

    wget -O mdg-deploy.zip https://github.com/akashihi/mdg-deploy/archive/master.zip
    unzip mdg-deploy.zip
    sudo docker-compose -f mdg-deploy-master/compose/docker-compose.yml up
MDG should start in several seconds, depending on your hardware and internet connection and web interface will be available at http://yourip/

There are two docker compose files:
* docker-compose.yml will start last released "stable" version of MDG
* next.yml will start latest dev build version of MDG

Ansible based deployment procedure, mentioned above, uses same docker compose approach internally.

### Deploy from source code

Deployment from the source code is the most complex, but may be useful in case you do not like docker or would like to improve MDG. 

#### Prerequisites

Building:

* [SBT 0.13](https://www.scala-sbt.org/)
* [Go version 1.8.3 ](https://golang.org/)
* [NPM version 3.10.10](https://www.npmjs.com/)

Other (and newer) versions should work too.

Deployment:

* [PostgreSQL 9.x](https://www.postgresql.org/)
* [ElasticSearch 6.x](https://www.elastic.co/downloads/elasticsearch)
* [Nginx](https://www.nginx.com/)

#### Getting source code

MDG consists of three sub applications:

* MDG server
* MDG Web UI
* MDG rates loader (this one periodically loads currency exchange rates)

You can get source code for all of them by cloning git repositories:

    git clone https://github.com/akashihi/mdg.git
    git clone https://github.com/akashihi/mdg-web-ui.git
    git clone https://github.com/akashihi/mdg-rate-loader.git

#### Building

To build MDG server you need to use Scala built tool:

    cd mdg
    sbt dist

This will produce file `target/universal/mdg.zip`.

Building rate loader is almost same procedure:

    cd mdg-rate-loader
    go build

This will make a `mdg-rate-loader` binary.

Finally, a web ui requires one more step:

    cd mdg-web-ui
    npm install
    npm run build

This will produce a `dist.tar.gz` archive.

#### Environment preparation

Start postgresql and create a database, using sql script at `mdg/docs/createdb.sql`

Download [hunspell dictionaries](https://github.com/elastic/hunspell.git) and put the to the elastic configuration directory. Start elastic and, optionally, create indices, using definition from `mdg/docs/es_schema.json` Indices may be recreated at any moment using web ui.

Configure nginx to serve web ui files and proxy mdg server. Sample server configuration is below:

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   /opt/mdg-web-ui;
            index  index.html index.htm;
        }

        location /api {
             proxy_pass http://localhost:9000;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
             proxy_set_header X-Forwarded-Port $server_port;
        }

        error_page 404 =200 /index.html;
    }

#### Starting MDG

* `unzip mdg.zip` somewhere, say `/opt/mdg` and run `/opt/mdg/bin/mdg`. This will start server and create database structure.
* Start rate loading by running binary `mdg-rate-loader`
* Unpack web ui archive with `tar zxvf dist.tar.gz` to the path, specified in nginx config (`/opt/mdg-web/ui` for example) and start nginx.

Check that everything works by accessing web uiser interface.

## Usage

TBD

## Development

TBD

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/akashihi/mdg/tags). 

## Authors

* **Denis Chaplygin** - *Initial work* - [akashihi](https://github.com/akashihi)

## License

This project is licensed under the GPLv3 License - see the LICENSE file for details.
