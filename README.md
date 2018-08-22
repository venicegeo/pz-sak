# Swiss Army Knife

The pz-sak project is an angular-based Swiss Army Knife (SAK) UI front end for testing, demonstrating and administration of Piazza services. SAK is a web application that administrative users can log into to execute certain requests through the Gateway, and more importantly, track logging and other reporting information about the internal details of Piazza. This tool is intended for administrative users only; those who needs direct access to Piazza outside of just the user API.

***
## Requirements
Before building and running the pz-sak project, please ensure that the following components are available and/or installed, as necessary:
- [nginx (1.8.1 or later)](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (for checking out repository source)
- A Piazza-provided API Key - Ask the Piazza team if you need help getting one
- [NodeJS (version 5 or later)](https://nodejs.org/en/download/)

>__Note:__ Unit tests require NodeJS 5 or later (for any `npm` command)

## Setup
Navigate to the project root directory where the repository will live, and clone the git repository in that location:

	$ mkdir -p {PROJECT_DIR}/src/github.com/venicegeo
	$ cd {PROJECT_DIR}/src/github.com/venicegeo
    $ git clone git@github.com:venicegeo/pz-sak.git
    $ cd pz-sak

## Running
1. Copy `nginx.conf` from `{sak_repo_root}/dev` to `{nginx_install_dir}/conf`
2. Edit `nginx.conf` line 50 to point to your sak location `{sak_repo_root}`
3. Start nginx and go to `https://localhost/`

	$ sudo /etc/init.d/nginx start

## Running unit tests
1. Make sure the app isn't running
2. From the project's root directory, run `npm install`
3. Run `./node_modules/karma/bin/karma start`

>__Troubleshooting:__ If phantomjs is having problems starting it may need to be installed globally via `npm install -g phantomjs-prebuilt`
