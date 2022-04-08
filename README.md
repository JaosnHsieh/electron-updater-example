# electron-updater-example

this repo demonstrate how to use `electron-updater` with `generic` provider( a local http files server ) to auto update ( detect new version then quit, install new version ) on my `windows 10`.

## Install

`$ git clone https://github.com/JaosnHsieh/electron-updater-example.git`

`$ yarn`

## Start http server ( generic provider and renderer index.html)

`$ yarn live-server` (it will start an http server on 8080 port, might have to run Powershell with Administrator )

## Packed app update

start http server first

1. `$ yarn dist` -> generate `v30.0.0` and copy to `www`

2. modify version to `30.0.1` in `package.json` and `$ yarn dist`

3. install `30.0.0` by opening `./www/*30.0.0*.(dmg|exe)`

4. open the app and it will install the update

## Unpacked app update ( dev )

1. `$ yarn dist` -> generate `v30.0.0` and copy to `www`

2. `$ yarn run dev`

## references

electron-webpack-quick-start
https://github.com/electron-userland/electron-webpack-quick-start

Example using electron-updater with `generic` provider.
https://gist.github.com/iffy/0ff845e8e3f59dbe7eaf2bf24443f104
