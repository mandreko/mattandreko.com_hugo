---
date: "2014-12-17"
linktitle: Compiling SSLScan with SSLv2 support on OSX
title: Compiling SSLScan with SSLv2 support on OSX
highlight: "true"
---

{% img left /images/sslscan_apple.png %}

SSLScan is a tool that I often use when validating SSL findings on
penetration tests. I had recently seen a new version come out, with
color highlighting and more fanciness, but wanted it for OSX. When I
tried to compile it, I noticed that it did not support SSLv2, which is
something I often screenshot, so I dived into getting it all working.

<!-- more -->

This guide will outline how to compile the newer versions of SSLScan
with color highlighting, on OSX while retaining SSLv2 capabilities.
It has so far only been tested against OSX Yosemite.

### Downloading the source code

For this example, the project will be built in a folder on the Desktop.
This folder can be deleted after the process, or stored in a more
convenient location. I typically use '~/Development/'.

```sh
$ mkdir ~/Desktop/tmp
$ cd ~/Desktop/tmp
```

Then download the SSLScan code using 'git'

```sh
$ git clone https://github.com/rbsec/sslscan.git
```

Go into the newly downloaded folder, and download OpenSSL 

```sh
$ cd sslscan
$ wget https://www.openssl.org/source/openssl-1.0.1j.tar.gz
```

Extract the tarball, and move the folder to 'openssl'. This step is
important, as the Makefile for SSLScan later on will utilize this folder
when it looks for OpenSSL.

```sh
$ tar -xzvf openssl-1.0.1j.tar.gz
$ mv openssl-1.0.1j openssl
```

### Compiling OpenSSL

To build these applications, you must have XCode installed with the
command line tools. One easy way to do this, is to run the following
line:

```sh
$ xcode-select --install
```

Then change to the OpenSSL directory to prepare for compilation.

```sh
$ cd openssl
```

Run the configuration script with options that define MacOSX 64-bit.

```sh
$ ./Configure darwin64-x86_64-cc
```

Once that is complete, run the 'make' command to build OpenSSL.  This
step may take a while.

```sh
$ make
```

### Compiling SSLScan with new OpenSSL

Now that OpenSSL is built, go back to the SSLScan directory.

```sh
$ cd ..
```

To build SSLScan using the custom version of OpenSSL, the easiest way is
to use the Makefile's build target, which is already configured:
```sh
$ make static
```

The only side effect this will have, is that the 'sslscan' file will be
a bit large, as OpenSSL has been statically linked to the executable. In
most cases this will be the intended outcome, when compiling on OSX.

The next step is optional. If you want to be able to run 'sslscan'
without using the full path, you need to install it to your system. The
Makefile failed for me, so I had to manually do it. Note that you will
need to run this with sudo, as your user probably can not write to
/usr/bin/:

```sh
$ sudo cp sslscan /usr/bin/
```

### Conclusion

After following these steps, it should now be possible to run SSLScan
successfully. To test it, simply run:

{% img center /images/sslscan_syncoutlook.png %}
