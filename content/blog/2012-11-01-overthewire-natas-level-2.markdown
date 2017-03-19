---
title: "OverTheWire Natas Level 2"
date: "2012-11-01T06:36:00-04:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - html
 - hacking
---

[Level 2](http://www.overthewire.org/wargames/natas/natas2.shtml) of [OverTheWire's](http://www.overthewire.org) Natas wargame is a little more fun than the previous two. It's also pretty simple, though.

<!-- more -->

You start out on a page that tells you that there is nothing on it.

{{% figure class="img-responsive" src="/img/natas2_1.png" %}}

Like previous levels, I then viewed the source to see what was in the code.

{{% figure class="img-responsive" src="/img/natas2_2.png" %}}

It appears that there's a 1x1 pixel image present on the page. It's located in a "files" directory of the webserver. I decided to see if there was anything else in that folder, and found a "users.txt" file.

{{% figure class="img-responsive" src="/img/natas2_3.png" %}}

Once I viewed the "users.txt" file, it displayed the next level's password.

{{% figure class="img-responsive" src="/img/natas2_4.png" %}}
