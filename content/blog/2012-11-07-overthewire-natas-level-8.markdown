---
layout: post
title: "OverTheWire Natas Level 8"
date: "2012-11-07T05:56:00-05:00"
comments: true
categories:
 - overthewire
 - wargames
 - encoding
 - natas
 - php
 - hacking
---

[Level 8](http://www.overthewire.org/wargames/natas/natas8.shtml) of the [OverTheWires](http://www.overthewire.org) Natas wargame was pretty simple, as a developer, but could prove more difficult if you don't have similar background.

<!-- more -->

It starts out with a secret password input.

{% img /images/natas8_1.png %}

Like other levels, I looked at the source code to see what was going on in the background.

{% img /images/natas8_2.png %}

Based on this code, you can see that it has a stored secret value, that is base64 encoded, then reversed, and then converted to a hex string. That value is then compared to the stored secret value, and if it's a match, it will give you the next level's password.

I decided to write a reversal program in php, since it was super easy. The only problem it gave me, was that there is no built-in hex2bin method until a newer version of PHP than I had on my machine. Luckily, on the [bin2hex](http://www.php.net/manual/en/function.bin2hex.php) documentation page, someone kindly wrote a reversal function that I stole.

{% img /images/natas8_3.png %}

Once I executed that program in php, it gave me the decoded password. Once I entered it into the page, it gave me the password to the next level.

{% img /images/natas8_4.png %}
