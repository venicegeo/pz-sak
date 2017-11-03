#!/bin/bash

resolvers=(`grep nameserver /etc/resolv.conf | awk '$2 != "127.0.0.1" {print $2}' | head -n1`)
cat > ./resolvers.conf << EOM
resolver ${resolvers[*]} valid=30s;
EOM
