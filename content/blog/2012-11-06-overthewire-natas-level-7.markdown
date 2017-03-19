---
layout: post
title: "OverTheWire Natas Level 7"
date: "2012-11-06T05:32:00-05:00"
comments: true
categories:
 - directorytraversal
 - overthewire
 - wargames
 - natas
 - hacking
---

Finally, with level 7 of OverTheWire's Natas wargame, we start to get to more "real world" vulnerabilities. It's still very easy, but it's at least getting better.

<!-- more -->

We start with a single page, that has 2 navigation links.

{% img /images/natas7_1.png %}

I noted that the URLs had a "page=" parameter. I thought maybe this would be the file it was including. Viewing the source gave a nice reminder of where the password for the next level would be stored.

{% img /images/natas7_2.png %}

I then tried a directory traversal exploit, pointing to the password file for the next level. It successfully displayed the password.

{% img /images/natas7_3.png %}
