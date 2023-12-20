#! /bin/bash

echo "Building API Server For C# Mono"

rm -r -f ./app

dotnet restore "StatusTracker/StatusTracker.csproj"
dotnet build "StatusTracker/StatusTracker.csproj" -c Release 

xbuild /property:Configuration=Release ./StatusTracker/StatusTracker.csproj

cp -r ./StatusTracker/bin/Release/ ./app/

echo "Building App For Web + Android"

cd ./mobile
wsl bash ./build.sh

sleep 10s

echo "Copying artifacts to /app"

cp -r ./web-build/ ../app/site/
cp -r ./app-build/ ../app/site/builds/

#echo "Created app.zip"
#7z a app.zip ./app

echo "Cleaning Up";
rm -r -f ./web-build
rm -r -f ./app-build

echo "Finished Build!"

read