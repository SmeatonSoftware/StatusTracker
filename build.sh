#! /bin/bash

echo "Building API Server For C# Mono"

rm -r -f ./app

#---------------------------------------------------------

dotnet restore "StatusTracker/StatusTracker.csproj"
dotnet build "StatusTracker/StatusTracker.csproj" -c Release 

xbuild /property:Configuration=Release ./StatusTracker/StatusTracker.csproj

cp -r ./StatusTracker/bin/Release/ ./app/

cd ./app
find . -name "*.xml" -type f|xargs rm -f
cd ..

#---------------------------------------------------------

echo "Building Web Site"

cd ./mobile

npm i

npx expo export:web
cp -r ./web-build/ ../app/site/
rm -r -f ./web-build

echo "Built Website"

#---------------------------------------------------------

echo "Press Any Key To Build Android App"
read

echo "Building Android App"

mkdir mobile-build

npx eas build --platform android --profile production
artifact=$(npx eas build:list | grep -o 'Artifact .*' | cut -d':' -f2 | head -1)

echo "https:$artifact"

curl -Lo "mobile-build/android.apk" "https:$artifact"
cp -r ./mobile-build/ ../app/mobile/
rm -r -f ./mobile-build

echo "Built Android"

read