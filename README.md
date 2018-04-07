# Kibella

Kibella is a Self-service BI/Dashboarding Tool.

Upon writing these lines (2018/4), Kibella is the only open source, self-service BI 
solution that is running on a simple, easy & cheap to maintain infrastructure.

The design tool (to create new dashboard or to edit/customize existing dashboards) is 
running 100% in the Browser so that there can be an unlimited of dashboard designers.

The Front-End is coded with Angular.js & Webpack + Grunt
The Back-End is running on a simple Apache Server and a SQL (e.g. SQLite) database.

Kibella should run in any setup composed of the "Apache Web Server" and PHP.
Typical examples of such setup includes:
  * LAMP: https://en.wikipedia.org/wiki/LAMP_(software_bundle)
  * WAMP: https://en.wikipedia.org/wiki/LAMP_(software_bundle)#WAMP

Under MS-Windows, Kibella runs inside the famous open-source&free project "WAMP" 
that you can download here
  http://www.wampserver.com/en/
Because of the limitations of Windows, the installation of Kibella inside a WAMP server
requires a few additional steps that are 100% automated thanks to the tools included 
inside the additional GitHub Project named "Kibella_WAMP".


---
# Installation for Simple Users (i.e. non developpers)

1. Linux/LAMP Installation.
   * Copy the Kibella files inside a directory XX served by Apache.
   * unzip the file "default_data/income.zip" inside the directory XX/../data
   * Add inside the root of the Kibella Install directory a file named ".htaccess" that contains 
     these 2 lines:
		RewriteEngine on
		RewriteRule (db/.*) JSON_SQL_Bridge/requests.php [L]
     For your convenience, such a file is provided inside the Kibella repository.

2. Windows/WAMP Installation

2.1. Automated install
   * Download the ZIP from the latest Kibella release and unzip it in "c:\WAMP"
   * run the file "InstallWamp64.exe" located in "c:\WAMP"
   * run the file "wampmanager.exe" located in "c:\WAMP"

2.2. Manual install
   * Download&Install a classic WAMP server from 
        http://www.wampserver.com/en/
   * Download the files from the GitHub Project named "Kibella_WAMP" and copy these files
     inside your WAMP install directory
   * Run the file "InstallWamp64.exe" (from the Project named "Kibella_WAMP").
   * Copy the Kibella files inside a directory XX served by Apache.
   * unzip the file "default_data/income.zip" inside the directory XX/../data



# Installation for Developpers

For windows developpers, the best way to work on Kibella is to use the 
"Ubuntu on Windows". More information on this subject here:
  https://docs.microsoft.com/en-us/windows/wsl/install-win10

1. Install npm dependencies at root of project for Grunt & Webpack and in `/interface` for 
   front-end dependencies with `npm install` in `/`
   
   This should download & unpack a whole bunch of required third party librairies. These 
   librairies will be located in the 2 directories "node_modules" and "interface/node_modules".
   For your convenience, I packed all these librairies in one big zip file here:


2. If it's your first time using grunt, you must install it globally 
   with `npm install -g grunt-cli`


# Config
Change hostname and port in `interface/config`
* the default is `"elasticsearch": "../db"`
* custom must include full hostname + absolute path, eg: "http://localhost:8988/kibella/db"

# Build

## Development

```
(sudo) grunt dev
```

*This will delete all in `/dev` if it exist, copy all the non-interface 
folders (`/public`,`/src`...) and transpile the bundle within `/dev/interface`  
and keep the process alive for watching your modifications (webpack --watch)*

## Distribution

```
(sudo) grunt dist
```

*This will delete all in `/dist` if it exist, copy all the non-interface folders 
(`/public`,`/src`...) and transpile the bundle within `/dist/interface`*

---


Copyright 2017 Frank Vanden berghen
All Right reserved.