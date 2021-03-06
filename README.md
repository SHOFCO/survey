# Editing the survey

* Download TextMate
* Navigate to TextMate > Preferences > Bundles
* Check YAML
* Before editing: Make sure the bottom bar shows "Soft Tabs: 4"
* If part of an entry shows up as white, wrap it in quotes.


# TODO

* Number field min/max support + validation

Nice to have:

* Password style input for PIN for signature control and log in
* Local storage: survey in progress (1 hour)
* Class hierarchy for input controls
* Unit tests for input controls
* Connect household chart count with "How many people live in your house?" question


# Notes

## Setting up a device for development

http://developer.android.com/tools/device.html

## Using Chrome to attach remotely

https://developer.chrome.com/devtools/docs/remote-debugging

## Dev environment set up

### Install node.js

https://nodejs.org/en/

### Install JDK

Mac: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

### Install Android command line tools

https://developer.android.com/studio/index.html#downloads

Run `tools/android`

Install Android 4.4.2 SDK

Set `ANDROID_HOME` in .bash\_profile

### Install Cordova

npm install -g cordova

### Add Cordova platforms

```
cordova platform add android --save
cordova platform add browser --save
```

### Install yaml library for python

```
easy_install PyYAML
```

This may give errors - these can be ignored!

## Building a new app binary

```
cordova build android --debug
```

Upload to Dropbox

Get and send Dropbox sharing link
