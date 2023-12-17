#! /bin/bash

echo "Building API Server For\nC#\nMono"

rm -r -f ./app

dotnet restore "StatusTracker/StatusTracker.csproj"
dotnet build "StatusTracker/StatusTracker.csproj" -c Release 

xbuild /property:Configuration=Release ./StatusTracker/StatusTracker.csproj

cp -r ./StatusTracker/bin/Release/ ./app/

echo "Building App For Web + Android"

cd ./mobile
wsl bash ./build.sh
cd ..

echo "Copying artifacts to /app"

cp -r ./mobile/web-build/ ./app/site/
cp -r ./mobile/app-build/ ./app/site/builds/

echo "Created app.zip"
7z a app.zip ./app

echp "Cleaning Up";
rm -r -f ./mobile/web-build
rm -r -f ./mobile/app-build

echo "Finished Build!"

read