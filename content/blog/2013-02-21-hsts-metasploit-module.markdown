---
layout: post
title: "HSTS Metasploit Module"
date: "2013-02-21T13:20:00-05:00"
comments: true
categories:
 - http
 - security
 - metasploit
---

I have been working as a security consultant for a few months now, and one finding that is on almost every webserver I come across, is the lack of an [HSTS (HTTP Strict Transport Security)](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) implementation. This is understandable, since HSTS is still fairly new. In fact, before starting at [Accuvant](http://www.accuvant.com), I had never heard of it either! However, since most browsers support it now, I wanted to be able to report on it. As of the time of this post, [Nexpose](https://www.rapid7.com/products/nexpose) does not have a finding for this item, but I believe [Nessus](http://www.tenable.com/products/nessus) does. To report on this finding, and provide a screenshot evidence to customers, we were often resorting to manually looking at the headers, or implementing home-made scripts to do it.

<!-- more -->

## Wait, HSTS? What are you talking about?

When you visit a website over unsecured HTTP, it's often considered a best practice to do a 302 redirect to the HTTPS site. That way, when browser users just type in the domain, it gets redirected to the secure site. When the "Strict-Transport-Security" header is added to the HTTPS response, the client then knows for a certain amount of time (based on the header's value) to ONLY request the HTTPS version of the site. This can greatly reduce the chances of phishing.

One convenient thing that will occur with HSTS, is that even if you make requests to the HTTP version of the site, the browser will actually bypass that, and request straight from the HTTPS site. This prevents leaks that often occur with images, stylesheets, and scripts.

## Get to the module already!

The crew over on the [Metasploit](http://www.metasploit.com) team were really quick adding this module, which isn't surprising since it was super easy to implement. I was honestly surprised that nobody had done it already. The code can be found [here](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/scanner/http/http_hsts.rb).

## So how do I use this thing?

The usage is pretty simple. First, load up Metasploit and gaze at the ASCII-art:

```
420-1572-man:~ mandreko$ msfconsole

 ______________________________________________________________________________
|                                                                              |
|                   METASPLOIT CYBER MISSILE COMMAND V4                        |
|______________________________________________________________________________|
      \                                  /                      /
       \     .                          /                      /            x
        \                              /                      /
         \                            /          +           /
          \            +             /                      /
           *                        /                      /
                                   /      .               /
    X                             /                      /            X
                                 /                     ###
                                /                     # % #
                               /                       ###
                      .       /
     .                       /      .            *           .
                            /
                           *
                  +                       *

                                       ^
####      __     __     __          #######         __     __     __        ####
####    /    \ /    \ /    \      ###########     /    \ /    \ /    \      ####
################################################################################
################################################################################
# WAVE 4 ######## SCORE 31337 ################################## HIGH FFFFFFFF #
################################################################################
                                                           http://metasploit.pro


       =[ metasploit v4.6.0-dev [core:4.6 api:1.0]
+ -- --=[ 1048 exploits - 589 auxiliary - 174 post
+ -- --=[ 275 payloads - 28 encoders - 8 nops

msf >
```
Next, just load up the HSTS Scanner module and look at the options: 

```
msf > use auxiliary/scanner/http/http_hsts 
msf  auxiliary(http_hsts) > show options

Module options (auxiliary/scanner/http/http_hsts):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   Proxies                   no        Use a proxy chain
   RHOSTS                    yes       The target address range or CIDR identifier
   RPORT    443              yes       The target port
   SSL      true             yes       Negotiate SSL for outgoing connections
   THREADS  1                yes       The number of concurrent threads
   VHOST                     no        HTTP server virtual host

msf  auxiliary(http_hsts) > 
```

Add the hosts that you want to scan, by setting the "RHOSTS" variable: 

```
msf  auxiliary(http_hsts) > set rhosts www.paypal.com, www.google.com, www.yahoo.com, www.wikipedia.org
rhosts => www.paypal.com, www.google.com, www.yahoo.com, www.wikipedia.org
msf  auxiliary(http_hsts) > 
```

Once you're ready, just run the module: 

```
msf  auxiliary(http_hsts) > run

[+] 23.65.2.234:443 - Strict-Transport-Security:max-age=14400, max-age=14400
[-] 74.125.131.99:443 No HSTS found.
[*] Scanned 02 of 18 hosts (011% complete)
[-] 74.125.131.104:443 No HSTS found.
[-] 74.125.131.106:443 No HSTS found.
[*] Scanned 04 of 18 hosts (022% complete)
[-] 74.125.131.147:443 No HSTS found.
[-] 74.125.131.105:443 No HSTS found.
[*] Scanned 06 of 18 hosts (033% complete)
[-] 74.125.131.103:443 No HSTS found.
[*] Scanned 08 of 18 hosts (044% complete)
[-] 98.139.183.24:443 No HSTS found.
[*] Scanned 09 of 18 hosts (050% complete)
[*] Scanned 11 of 18 hosts (061% complete)
[*] Scanned 13 of 18 hosts (072% complete)
[*] Scanned 15 of 18 hosts (083% complete)
[-] 208.80.154.225:443 No HSTS found.
[*] Scanned 17 of 18 hosts (094% complete)
[*] Scanned 18 of 18 hosts (100% complete)
[*] Auxiliary module execution completed
msf  auxiliary(http_hsts) > 
```

You can see that out of all of those hosts, paypal.com (23.65.2.234) was the only one that implemented the HSTS header.
