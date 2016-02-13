# Datorama Stocks App Viewer
Web viewer for watching stocks info.

This app is as requested in the "Frontend Developer-House Test" with 2 extra features:

1. Clear table function
* Add to table function

## Installation
First lets install some stuff.
If you don't have Node.js and npm installed, please [download](https://nodejs.org/en/download/) and install them. <br>
It is recommended to download the LTS version (which is currently version 4.3.0).

Go ahead and navigate to the project's directory:
```shell
cd <project directory>
```

Now, please install globally the package ```http-server```:
```shell
npm install -g http-server@0.8.5
```

And also bower (being used to download jQuery):
```shell
npm install -g bower@1.7.7
```

After that, please install all of the npm dependencies:
```shell
npm install
```

Now, install all of bower's dependencies:
```shell
bower install
```

You are ready to go!

## Running the server
Use ```http-server``` to start your web server:
```shell
http-server ./app
```

That's it!<br>
Now just navigate on your browser to the address [http://localhost:3000](http://localhost:8080)

Have fun!

## Tests
The website has been tested on:

1. Chrome
* Firefox
* Safari v5.1.7**
* IE11*

\* No version of IE below IE11 has been tested since non of them has a lot of usage + [Microsoft has deprecated these versions](https://www.fireeye.com/blog/threat-research/2016/01/end_of_life_for_ie.html).
\*\* No later version of Safari was tested since this is the latest release for Windows PC computers + [Apple apparently kills Windows PC support in Safari 6.0](http://appleinsider.com/articles/12/07/25/apple_kills_windows_pc_support_in_safari_60)