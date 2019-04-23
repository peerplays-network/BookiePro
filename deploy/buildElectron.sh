#!/bin/bash
rm -rf BookiePro || true
git clone -b $BRANCH https://github.com/peerplays-network/bookiepro.git
sh /usr/local/bin/BookiePro/run-all.sh $VERSION