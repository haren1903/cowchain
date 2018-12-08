#!/bin/bash

#
# Copyright 4eyes GmbH (https://www.4eyes.ch/) All Rights Reserved.
#
# this script configures and creates the rest server and mongoDB containers
#

# Grab the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# set all variables in .env file as environmental variables
set -o allexport
source ${DIR}/.env
set +o allexport


# Print the usage message
function printHelp () {
  echo "Usage: "
  echo "  ./rest-server.sh -m build|start|stop|down|recreate"
  echo "  ./rest-server.sh -h|--help (print this message)"
  echo "    -m <mode> - one of 'build', 'start'"
  echo "      - 'build' - pull the docker images and start the containers"
  echo "      - 'start' - start mongoDB & rest server containers"
  echo "      - 'stop' - stop mongoDB & rest server containers"
  echo "      - 'recreate' - recreate mongoDB & rest server containers"
}

# Get network name
function askNetworkName () {
    read -p "Business network name: " COMPOSER_NETWORK_NAME
    if [ ! -d "../composer/$COMPOSER_NETWORK_NAME" ]; then
        echo "Business network not found! Enter Business network name which you defined during building the composer network."
        askNetworkName
    fi
}

# Configure and start the docker containers
function build() {

    askNetworkName

    rm -rf ${DIR}/.composer
    mkdir ${DIR}/.composer
    mkdir ${DIR}/.composer/cards
    mkdir ${DIR}/.composer/cards/${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME}
    mkdir ${DIR}/.composer/client-data
    mkdir ${DIR}/.composer/client-data/${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME}
    mkdir ${DIR}/.composer/logs

    cp -r ../composer/.composer/cards/${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME}/. ${DIR}/.composer/cards/${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME}
    cp -r ../composer/.composer/client-data/${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME}/. ${DIR}/.composer/client-data/${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME}

    # remove old containers and images
    docker stop single-user-rest-server.${DOMAIN} || true && docker rm -f single-user-rest-server.${DOMAIN} || true && docker rmi -f ${DOMAIN}/rest-server || true

    # Build the extended Docker image by running the following docker build command in the directory containing the file named Dockerfile.
    cd ${DIR}/docker
    docker build -t ${DOMAIN}/rest-server .
    cd ${DIR}

    createContainers

}


function createContainers() {

    # Start a new instance of the extended Docker image for the REST server that created.
    # This REST server will run in single-user mode and used to the create participants and cards.
    docker run \
        -d \
        -e COMPOSER_CARD=${CA_USER_ENROLLMENT}@${COMPOSER_NETWORK_NAME} \
        -e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
        -e COMPOSER_AUTHENTICATION=false \
        -e COMPOSER_MULTIUSER=false \
        -e COMPOSER_TLS=${COMPOSER_TLS} \
        -e COMPOSER_WEBSOCKETS=${COMPOSER_WEBSOCKETS} \
        -e PORT=3000 \
        -e TZ=${TIME_ZONE} \
        -v ${DIR}/.composer:/home/composer/.composer \
        --name single-user-rest-server.${DOMAIN} \
        --network ${FABRIC_DOCKER_NETWORK_NAME} \
        -p 3000:3000 \
        ${DOMAIN}/rest-server
}

function recreate() {

    askNetworkName

    docker stop single-user-rest-server.${DOMAIN} || true && docker rm -f single-user-rest-server.${DOMAIN} || true

    createContainers

}

# start the docker containers
function start() {
    docker start single-user-rest-server.${DOMAIN}
}

# stop the docker containers
function stop() {
    docker stop single-user-rest-server.${DOMAIN}
}

# removing containers and cards
function down() {

    # remove old containers and images
    docker stop single-user-rest-server.${DOMAIN} || true && docker rm -f single-user-rest-server.${DOMAIN} || true && docker rmi -f ${DOMAIN}/rest-server || true

    # remove ledger data
    ARCH=`uname -s | grep Darwin`
    if [ "$ARCH" == "Darwin" ]; then
      rm -rf ${DIR}/.composer
    else
      sudo rm -rf ${DIR}/.composer
    fi
}


# Parse commandline args
while getopts "h?m:" opt; do
  case "$opt" in
    h|\?)
      printHelp
      exit 0
    ;;
    m)  MODE=$OPTARG
    ;;
  esac
done

# Determine whether building, starting or stopping for announce
if [ "$MODE" == "build" ]; then
  EXPMODE="Building"
  elif [ "$MODE" == "start" ]; then
    EXPMODE="Starting"
  elif [ "$MODE" == "stop" ]; then
    EXPMODE="Stopping"
  elif [ "$MODE" == "down" ]; then
    EXPMODE="Remove the containers"
  elif [ "$MODE" == "recreate" ]; then
    EXPMODE="Recreating"
else
  printHelp
  exit 1
fi

# Announce what was requested
echo "${EXPMODE}"

# building, starting or stopping the network
if [ "${MODE}" == "build" ]; then
  build
  elif [ "${MODE}" == "start" ]; then
    start
  elif [ "${MODE}" == "stop" ]; then
    stop
  elif [ "${MODE}" == "down" ]; then
    down
  elif [ "${MODE}" == "recreate" ]; then
    recreate
else
  printHelp
  exit 1
fi