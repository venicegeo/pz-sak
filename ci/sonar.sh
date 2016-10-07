#!/bin/bash -ex

pushd `dirname $0`/.. > /dev/null
root=$(pwd -P)
popd > /dev/null

cd $root
npm install
./node_modules/karma/bin/karma --version
./node_modules/karma/bin/karma start
