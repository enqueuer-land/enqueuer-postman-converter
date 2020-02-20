# enqueuer-postman-converter
[![npm version](https://badge.fury.io/js/enqueuer-postman-converter.svg)](https://badge.fury.io/js/enqueuer-postman-converter) [![Build Status](https://travis-ci.org/enqueuer-land/enqueuer-postman-converter.svg?branch=master)](https://travis-ci.org/enqueuer-land/enqueuer-postman-converter) [![Greenkeeper badge](https://badges.greenkeeper.io/enqueuer-land/enqueuer-postman-converter.svg)](https://greenkeeper.io/)

Enqueuer plugin to convert and use postman collections as enqueuer requisitions.

#### Install
    $ npm install enqueuer-postman-converter
#### Usage as standalone CLI
    $ postman-nqr-converter postman-input-file enqueuer-output-file #converts postman-input-file to enqueuer-output-file  
    $ postman-nqr-converter -a postman-files* # converts every glob matching file    
#### Usage as enqueuer plugin
    $ nqr -a examples/postman.yml -l enqueuer-postman-converter

