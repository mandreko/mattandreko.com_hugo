---
layout: post
title: "OverTheWire Natas Level 10"
date: "2012-11-09T07:28:00-05:00"
comments: true
categories:
 - overthewire
 - wargames
 - commandinjection
 - natas
 - hacking
---

On to [Level 10](http://www.overthewire.org/wargames/natas/natas10.shtml) of the [OverTheWire](http://www.overthewire.org) Natas wargame! This level is extremely similar to level 9, except that now they are implementing a basic filtering, to prevent you from entering certain characters that could cause changes in the execution of the program. However, their filter is flawed.

<!-- more -->

It starts out just like the last level, with a search dialog.

{% img /images/natas10_1.png %}

Again, as always, I review the code since it's available. You can see that it's using a "preg_match" to try to filter out bad characters. This however is flawed still. Instead of a blacklist, it should be a whitelist of only certain values.

{% img /images/natas10_2.png %}

Because I can't complete the command using a semicolon or ampersand, and start a new one, I instead go with the approach of having "grep" just return me the password file as well as the dictionary. I enter, '"$" /etc/natas_webpass/natas11', and it is fairly successful. The "$" tells grep to search for any line that contains a "end of line". Since pretty much every line will have that, it outputs the entire file. I then include the password file as well as the dictionary, so it reads me both back. This then provides the password to the next level.

{% img /images/natas10_3.png %}
