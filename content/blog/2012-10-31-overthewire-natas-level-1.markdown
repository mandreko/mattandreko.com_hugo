---
title: "OverTheWire Natas Level 1"
date: "2012-10-31T06:17:00-04:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - html
 - hacking
aliases:
 - "/2012/10/30/overthewire-natas-level-1"
 - "/2012/11/11/overthewire-natas-level-1"
 - "/2012/11/14/overthewire-natas-level-1"
---

In continuing with the Natas wargame from [OverTheWire](http://www.overthewire.org), I tried my hand at [level 1](http://www.overthewire.org/wargames/natas/natas1.shtml). It too was pretty easy. It was just like the level 0, except that right-clicking was disabled via javascript.

<!-- more -->

You start out by being told that the password can be found on the page that you're on, just like the last one.

{{% figure class="img-responsive" src="/img/natas1_1.png" %}}

If you do try to right-click to view the source, you get a shiny error message stating that it has been blocked.

{{% figure class="img-responsive" src="/img/natas1_2.png" %}}

To get around that, there are a multitude of ways. You could use wget/curl to view the page. You could disable javascript in your browser. You could use the developer tools in your browser to navigate the DOM. You could even save the file to your hard drive, and open it in a text editor. Or, you could simply prepend the url in the address bar with "view-source:" like I did.

{{% figure class="img-responsive" src="/img/natas1_3.png" %}}
