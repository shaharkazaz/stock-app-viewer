# Datorama Stocks App Viewer
<what is here>?

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
sudo npm install -g http-server@0.8.5
```

And also bower (being used to download jQuery):
```shell
sudo npm install -g bower@1.7.7
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
* Safari
* IE11*
* Edge

\* No version of IE below IE11 has been tested since non of them has a lot of usage + [Microsoft has deprecated these versions](https://www.fireeye.com/blog/threat-research/2016/01/end_of_life_for_ie.html).
