---
title: "OverTheWire Monxla Part 1"
date: "2012-11-24T15:54:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - linux
 - monxla
---

I had a twitter [follower](https://twitter.com/Mito125twit) recently inform me that OverTheWire had a new wargame up and running. &nbsp;I was immediately excited and downloaded it. &nbsp;Several days later, I actually was able to start tinkering with it.

<!-- more -->

I booted up the image, and proceeded to do some preliminary nmap scans. &nbsp;I found a few services runinng:

```
mandreko$ nmap -sV -p1-65535 -T4&nbsp;192.168.188.134
Starting Nmap 6.01 ( http://nmap.org ) at 2012-11-15 10:28 EST
Nmap scan report for 192.168.188.134
Host is up (0.0077s latency).
Not shown: 65511 closed ports
PORT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; STATE SERVICE VERSION
22/tcp&nbsp;&nbsp;&nbsp; open&nbsp; ssh&nbsp;&nbsp;&nbsp;&nbsp; OpenSSH 5.8p1 Debian 7ubuntu1 (protocol 2.0)
80/tcp&nbsp;&nbsp;&nbsp; open&nbsp; http&nbsp;&nbsp;&nbsp; Apache httpd 2.2.20 ((Ubuntu))
6667/tcp&nbsp; open&nbsp; irc&nbsp;&nbsp;&nbsp;&nbsp; Unreal ircd
8000/tcp&nbsp; open&nbsp; http&nbsp;&nbsp;&nbsp; Icecast streaming media server
21342/tcp open&nbsp; unknown
21768/tcp open&nbsp; unknown
21951/tcp open&nbsp; unknown
23917/tcp open&nbsp; unknown
24578/tcp open&nbsp; unknown
24783/tcp open&nbsp; unknown
25275/tcp open&nbsp; unknown
26791/tcp open&nbsp; unknown
31308/tcp open&nbsp; unknown
31418/tcp open&nbsp; unknown
31874/tcp open&nbsp; unknown
32704/tcp open&nbsp; unknown
33039/tcp open&nbsp; unknown
34466/tcp open&nbsp; unknown
34538/tcp open&nbsp; unknown
34957/tcp open&nbsp; unknown
36199/tcp open&nbsp; unknown
37213/tcp open&nbsp; unknown
37628/tcp open&nbsp; unknown
37956/tcp open&nbsp; unknown
```

Based on the clue on the [Monxla page](http://www.overthewire.org/wargames/monxla), "Hint: how big is the page you are looking at?", I connected to the webserver.

{{% figure class="img-responsive" src="/img/monxla1_1.png" %}}

It looked like a fairly generic page, but I viewed the source, and found a huge amount of text commented out. &nbsp;Since it was all alpha-numeric other than ending with a single "=", I figured it was probably [Base64](https://en.wikipedia.org/wiki/Base64).

I copied the text into a new file on my machine. I then decoded it and found out what type of file it was:

```
mandreko$ base64 -D monxla -o monxla.decoded
mandreko$ file monxla.decoded
monxla.decoded: PDF document, version 1.4
mandreko$ mv monxla.decoded monxla.pdf
```

When the PDF (available <a href="https://docs.google.com/open?id=0B6AIn0P1_ECKbzJaMEQ0VXhsZU0">here</a>) is then opened, it shows a report of running services that may need attacked.  This is similar to "levels" in most wargames, I believe (I haven't yet finished this wargame). 

My next article in this series will show how to exploit the "Bookmarks Service".
