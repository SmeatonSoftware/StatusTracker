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

echo "Finished Build!"

read