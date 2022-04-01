# electron-updater-example

this repo demonstrate how to use `electron-updater` with `generic` provider( a local http files server ) to auto update ( detect new version then quit, install new version ) on my `windows 10`.

## Reproduce auto update steps

1. `$ git clone https://github.com/JaosnHsieh/electron-updater-example.git`
2. `$ yarn`
3. `$ yarn live-server` (it will start an http server on 8080 port, might have to run Powershell with Administrator )
4. `$ yarn dist`
5. copy `electron-webpack-quick-start Setup 0.0.1.exe`, `latest.yml` in `./dist/*` to `./www/*` ( mac  `electron-updater-example-0.0.1-mac.zip`, `electron-updater-example-0.0.1-mac.dmg` and `latest-mac.yml`)
6. change `package.json` version to `0.0.2`
7. `$ yarn dist`
8. copy `electron-webpack-quick-start Setup 0.0.2.exe`, `latest.yml` in `./dist/*` to `./www/*` ( replace `latest.yml` ), ( mac  `electron-updater-example-0.0.2-mac.zip`, `electron-updater-example-0.0.2-mac.dmg` and `latest-mac.yml`)
9. double click `electron-webpack-quick-start Setup 0.0.1.exe` to install it.
10. done. it should auto download 0.0.2 verison and quit and install it.

## references

electron-webpack-quick-start
https://github.com/electron-userland/electron-webpack-quick-start

Example using electron-updater with `generic` provider.
https://gist.github.com/iffy/0ff845e8e3f59dbe7eaf2bf24443f104