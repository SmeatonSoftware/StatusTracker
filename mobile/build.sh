#! /bin/bash

#https://stackoverflow.com/questions/49765669/failed-to-find-android-home-environment-variable-in-windows-10-linux-subsystem

export ANDROID_HOME="/mnt/c/Users/oscar/AppData/Local/Android/sdk"

export ANDROID_SDK_ROOT=${ANDROID_HOME}
export PATH=${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${PATH}

npx expo build:web
echo "Built For Web"

eas build --platform android --local --output "./app-build/app.apk"
echo "Built For Android"