#! /bin/bash

echo "Cleaning Past Builds"

echo "Building APP"

cd ./mobile

eas build --platform android

echo "Finished Build!"

read