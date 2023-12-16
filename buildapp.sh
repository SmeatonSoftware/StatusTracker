#! /bin/bash

echo "Cleaning Past Builds"

echo "Building APP"

cd ./mobile

wsl
eas build --platform android --local

echo "Finished Build!"

read