# Swiss Army Knife
Angular app for testing Piazza services

***
## Dependencies
* nginx 1.8.1

Note: Unit tests require NodeJS 5 or later (for any `npm` command)

## Running
1. Clone this repo
2. Copy nginx.conf from sak_repo_root/conf to nginx_install_dir/conf
3. Edit nginx.conf line 50 to point to your sak location
4. Start nginx and go to https://localhost/

## Running unit tests
1. Make sure the app isn't running
2. From the project's root directory, run `npm install`
3. Run `./node_modules/karma/bin/karma start`

Troubleshooting: If phantomjs is having problems starting it may need to be installed globally via `npm install -g phantomjs-prebuilt`

