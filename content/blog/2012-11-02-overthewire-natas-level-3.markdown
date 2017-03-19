---
layout: post
title: "OverTheWire Natas Level 3"
date: "2012-11-02T06:54:00-04:00"
comments: true
categories:
 - overthewire
 - wargames
 - natas
 - html
 - hacking
---

Continuing on with Level 3 of OverTheWire's Natas wargame, I found the first page, like previous levels, saying that there was nothing on the page.

<!-- more -->

{% img /images/natas3_1.png %}

I viewed the source and saw the strange comment about "Not even Google will find it".

{% img /images/natas3_2.png %}

After thinking about that for a minute, it clicked that maybe it was because of a "robots.txt" file, which would prevent search engines from finding any files. I then browsed to the "robots.txt" file.

{% img /images/natas3_3.png %}

Inside the "robots.txt" file, it shows a directory that it has asked to not be indexed by search engines. I then navigated to that folder, and found a "users.txt" file.

{% img /images/natas3_4.png %}

Lucky for me, the "users.txt" file, contained the next level's credentials.

{% img /images/natas3_5.png %}
