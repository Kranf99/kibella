# Kibella

Kibella is a Self-service BI/Dashboarding Tool.

Upon writing these lines (2018/4), Kibella is the only open source, self-service BI solution that is running on a simple, easy&cheap to maintain infrastructure (Apache+PHP). 

Kibella is so efficient that it runs easily on any basic WebHosting platform. For example, you can deploy a fully working Kibella dashboard on a Webserver that costs only 1.5€/month (from <a href="https://www.ovh.com/fr/hebergement-web/">here</a>). This makes Kibella the cheapest and the most versatile dashboarding solution available on the market.

The design tool (to create new dashboard or to edit/customize existing dashboards) is running 100% in the Browser so that there can be an unlimited of dashboard designers.

The Front-End is coded with Angular.js & Webpack + Grunt.
The Back-End is running on a simple Apache Server and a SQL (e.g. SQLite or SQLServer) database.

Kibella should run in any setup composed of the "Apache Web Server" and PHP.
Typical examples of such setup includes:
  * LAMP: https://en.wikipedia.org/wiki/LAMP_(software_bundle)
  * WAMP: https://en.wikipedia.org/wiki/LAMP_(software_bundle)#WAMP

Under MS-Windows, Kibella runs inside the famous open-source&free project "UwAMP" that you can download here
  https://www.uwamp.com/en/
The installation of Kibella inside a UwAMP server is now 100% automated: Just unzip the file "Kibella_UwAmp.zip" (available in the "releases" section), run "UwAmp.exe" and open inside your browser "http://localhost".


---
# LUNIX Installation for Simple Users (i.e. non developers)

* download and unzip the zip file "kibella_alone_linux.zip" (available in the "releases" section)
* Copy the Kibella files inside a directory XX served by Apache.
* Add inside the root of the Kibella Install directory a file named ".htaccess" that contains these 2 lines:
```
RewriteEngine on
RewriteRule (db/.*) JSON_SQL_Bridge/requests.php [L]
```
For your convenience, such a file is directly provided inside the Kibella distribution.

# Installation for Developers

For windows developers, the best way to work on Kibella is to use the 
"Ubuntu on Windows". More information on this subject here:
  https://docs.microsoft.com/en-us/windows/wsl/install-win10

1. install npm libraries 
   Here ar the installation instructions extracted from https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/:
```
sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install make
(cd /mnt/f/soft/UwAmp2/www/kibella_src)
```

2. Install npm dependencies at root of project for Grunt & Webpack and in `/interface` for front-end dependencies with `sudo npm install` in `/`
   
   This should download & unpack a whole bunch of required third party librairies. These librairies will be located in the 2 directories "node_modules" and "interface/node_modules". For your convenience, I also packed all these librairies in one big zip file here: https://github.com/Kranf99/kibella/releases/tag/v0.1

3. If it's your first time using grunt, you must install it globally 
   with `sudo npm install -g grunt-cli`

4. (optional) Config
    Change hostname and port in `interface/config`
    * the default is `"elasticsearch": "../db"`
    * custom must include full hostname + absolute path, eg:"http://localhost:8988/kibella/db"

5. Build
 5.1. Build a large index.js for easy debugging
```
(sudo) grunt dev
```

     This will delete all in `/dev` if it exist, copy all the non-interface folders (`/public`,`/src`...) and transpile the bundle within `/dev/interface` and keep the process alive for watching your modifications (webpack --watch)

 5.2. Build a small index.js for distribution

```
(sudo) grunt dist --force
```

      This will delete all in `/dist` if it exist, copy all the non-interface folders (`/public`,`/src`...) and transpile the bundle within `/dist/interface`*



# Troubleshooting

1. Troubleshooting Linux Installation

 1.1. Enable .htaccess application-specific configuration in the Apache server

Since Kibella contains a .htaccess configuration file (present in Kibella’s 
installation directory), Apache needs to be configured to enable its use.
To this end, verify that the Apache configuration file 
```
/etc/apache2/sites-available/default 
```
has the AllowOverride directive set to All inside the Directory directive block 
for the webserver directory (e.g. /var/www). This means that that part of the 
file should (typically) look like this:
```
<Directory /var/www>
      Options Indexes FollowSymLinks MultiViews
      AllowOverride All
      Order allow,deny
      Allow from all
</Directory>
```
If not, edit the "/etc/apache2/httpd.conf" configuration file (normally empty) 
and add the following lines:
```
<Directory /var/www/kibella>
      AllowOverride All
</Directory>
```

 1.2. Enable Apache’s rewrite module

Verify that the rewrite module is enabled by running:
```
sudo apache2ctl -M
```
where a module called "rewrite" should appear in the list.
If it does not appear, enable it with:
```
sudo a2enmod rewrite
```


Copyright 2017 Frank Vanden berghen
All Right reserved.
