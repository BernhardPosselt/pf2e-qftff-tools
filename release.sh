#!/usr/bin/env bash

# Run with ./release.sh 0.0.2
# requires zip and yarn

set -e

version="$1"

yarn run lint
yarn run clean
yarn run build

# create release directories
rm -r ./build
mkdir -p build/pf2e-qftff-tools/

# update manifest file
sed -i "s/\"version\":.*/\"version\": \"$version\",/g" module.json
sed -i "s/\"download\":.*/\"download\": \"https:\/\/github.com\/BernhardPosselt\/pf2e-qftff-tools\/releases\/download\/$version\/release.zip\"/g" module.json

# create archive
cp module.json build/pf2e-qftff-tools/module.json
cp README.md LICENSE CHANGELOG.md OpenGameLicense.md build/pf2e-qftff-tools/
cp -r packs/ maps/ templates/ styles/ dist/ build/pf2e-qftff-tools/
cd build
zip -r release.zip pf2e-qftff-tools
cd -
