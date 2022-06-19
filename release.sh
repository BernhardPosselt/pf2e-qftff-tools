#!/usr/bin/env bash

# Run with ./release.sh 0.0.2

set -e

version="$1"
new_module_json="release-manifests/module-$version.json"

# create directories
rm -r ./build
mkdir -p build/pf2e-qftff-tools/
mkdir -p release-manifests/

# create new manifest file
cp module.json "$new_module_json"
sed -i "s/\"version\":.*/\"version\": \"$version\",/g" "$new_module_json"

# create archive
cp "$new_module_json" build/pf2e-qftff-tools/
cp -r packs src/ build/pf2e-qftff-tools/
cd build
zip -r release.zip pf2e-qftff-tools
cd -
