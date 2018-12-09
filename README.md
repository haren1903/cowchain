# FHNW Master Thesis - Cowchain

Based on https://github.com/4eyes/workshoptage2018

Let's build a Blockchain application based on [Hyperledger Fabric](https://www.hyperledger.org/projects/fabric)
and [Hyperledger Composer](https://www.hyperledger.org/projects/composer).

## About 
My name is Harun Seyfettin Uslu, student at the FHNW in Switzerland.

## Supported platforms

These instructions are only for MacOSX and Linux (Debian or Ubuntu).

## Prerequisites
- cURL -> MacOSX: http://macappstore.org/curl & Ubuntu: $ sudo apt install curl 
- git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- Docker & Docker Compose -> https://docs.docker.com/compose/install/
- nodejs (8lts version) & npm -> https://nodejs.org/en/download/package-manager/

## Quick start

### Clone the Repository
- $ git clone https://github.com/haren1903/cowchain.git
- $ cd cowchain

### Fabric
- $ cd fabric

if you want to change the domain name of your organisation, you can change the DOMAIN variable value in .env file.
if you want to change the logging level of the peers you can change the FABRIC_LOGGING_LEVEL variable value from INFO to DEBUG in .env file.

#### download fabric binaries & docker images
- $ ./scripts/download.sh -m binaries
- $ ./scripts/download.sh -m images

#### Build the fabric network (for first time setup)
- $ ./fabric.sh -m build

now if you run 'docker ps' you wil see that all containers are running

### Composer
- $ cd composer/

#### Install Composer (for first time setup)
- $ ./composer.sh -m build

#### Deploy the network and create the cards (Business network name is 'cowchain') (for first time setup)
- $ ./composer.sh -m deploy     # business network name is 'cowchain' & it will take a while ;)

### Rest Server & mongo containers (Business network name is 'cowchain') (for first time setup)

#### Create rest & mongo containers
- $ cd rest-server/
- $ ./rest-server.sh -m build   # business network name is 'cowchain'

### Angular
- $ cd angular/
- $ npm install
- $ npm start
- Open http://localhost:4200/ on your browser


## Further Usage

### Start or stop the network (not for first time setup)
- $ cd fabric
- $ ./fabric.sh -m start
- $ ./fabric.sh -m stop

### Remove the network including the data 
- $ cd fabric
- $ ./fabric.sh -m down

### Recreate the containers without losing the data (not for first time setup)
- $  cd fabric/
- $ ./fabric.sh -m recreate

### If you want to update your business network (not for first time setup)
- $ cd composer/
- $ ./composer.sh -m upgrade    # business network name is 'cowchain'

### Start or stop composer-cli container (not for first time setup)
- $ cd composer/
- $ ./composer.sh -m start
- $ ./composer.sh -m stop

### Recreate the container without losing the data (not for first time setup)
- $ cd composer/
- $ ./composer.sh -m recreate

### Remove the composer container including the data 
- $ cd composer
- $ ./composer.sh -m down

### Start or stop the rest Server & mongo containers (not for first time setup)
- $ cd rest-server/
- $ ./rest-server.sh -m start
- $ ./rest-server.sh -m stop

### Recreate the containers without losing the data (not for first time setup)
- $ cd rest-server/
- $ ./rest-server.sh -m recreate

### Remove the rest & mongo containers including the data 
- $ cd rest-server/
- $ ./rest-server.sh -m down

## Links
- Hyperledger Fabric Documentation: https://hyperledger-fabric.readthedocs.io/en/release-1.1/
- Hyperledger Composer Documentation: https://hyperledger.github.io/composer/latest/installing/installing-index.html
- Hyperledger Composer Playground: https://composer-playground.mybluemix.net/
