#! /bin/bash

echo "Building Server"

rm -r -f ./app

dotnet restore "StatusTracker/StatusTracker.csproj"
dotnet build "StatusTracker/StatusTracker.csproj" -c Release 

xbuild /property:Configuration=Release ./StatusTracker/StatusTracker.csproj

cp -r ./StatusTracker/bin/Release/ ./app/

echo "Building APP"

cd ./mobile

wsl bash ./build.sh

cp -r ./web-build/ ../app/site/
cp -r ./app-build/ ../app/site/builds/

rm -r -f ./web-build
rm -r -f ./app-build

echo "Finished Build!"

read