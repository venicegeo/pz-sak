#!/bin/bash -ex

pushd `dirname $0`/.. > /dev/null
root=$(pwd -P)
popd > /dev/null

cd $root
node --version
npm --version
karma --version
karma start
