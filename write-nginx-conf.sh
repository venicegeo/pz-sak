#!/bin/bash

resolvers=(`grep nameserver /etc/resolv.conf | awk '$2 != "127.0.0.1" {print $2}' | head -n1`)
sed -i "s/resolver.*/resolver ${resolvers[*]} valid=30s;/g" $HOME/public/nginx.conf
