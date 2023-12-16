#! /bin/bash

echo "Cleaning Past Builds"

echo "Building APP"

rm -r -f ./app

dotnet restore "StatusTracker/StatusTracker.csproj"
dotnet build "StatusTracker/StatusTracker.csproj" -c Release 

xbuild /property:Configuration=Release ./StatusTracker/StatusTracker.csproj

cp -r ./StatusTracker/bin/Release/ ./app/

echo "Finished Build!"

read