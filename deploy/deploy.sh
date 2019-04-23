#!/bin/bash

# any future command that fails will exit the script
set -e

mkdir -p ~/.ssh
echo -e "$PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# disable the host key checking.
touch ~/.ssh/config
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config

# gets a list of servers from gitlab
DEPLOY_SERVERS=$QA_SERVERS

# split this string and convert this into array
ALL_SERVERS=(${DEPLOY_SERVERS//,/ })
echo "ALL_SERVERS ${ALL_SERVERS}"

# ssh into all servers and run updateAndRestart.sh
for server in "${ALL_SERVERS[@]}"
do
  echo "deploying to ${server}"
  ssh ubuntu@${server} BRANCH=$CI_COMMIT_REF_NAME VERSION=$BLOCKCHAIN 'bash -s' < ./deploy/updateAndRestart.sh
done

# build electron executables
ssh pbsa@$BUILD_SERVER BRANCH=$CI_COMMIT_REF_NAME VERSION=$BLOCKCHAIN 'bash -s' < ./deploy/buildElectron.sh