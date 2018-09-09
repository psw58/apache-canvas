# apache-canvas

## using lando apache simple server
.lando.yml
 
  name: apache-canvas
   
  proxy:
   
    html:
     
      - apache.lndo.site
       
  services:
   
    html:
     
      type: apache:2.2
       
      ssl: true
       
      webroot: www
       

## gulp sass compiler
npm install

from scratch
npm install -g gulp
 
npm install gulp gulp-sass gulp-less gulp-sourcemaps 

to run code tasks
ctrl-shift-b
