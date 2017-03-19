---
title: "OverTheWire Natas Level 4"
date: "2012-11-03T10:39:00-04:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - hacking
---

[Level 4](http://www.overthewire.org/wargames/natas/natas4.shtml) of [OverTheWire's](http://www.overthewire.org) Natas wargame starts a little different than the previous levels. It immediately presents you with an error message.

<!-- more -->

{{% figure class="img-responsive" src="/img/natas4_1.png" %}}

I figured this was going to be due to the HTTP Referer. I guessed that one could solve this by using a proxy or a browser addon, such as [Referer Control](https://chrome.google.com/webstore/detail/referer-control/hnkcfpcejkafcihlgbojoidoihckciin/related), but I simply didn't want to install anything new. I opened a bash window, and simulated my original HTTP GET.

{{% figure class="img-responsive" src="/img/natas4_2.png" %}}

Since I was then able to reproduce the error, I changed the HTTP Referer, and got the level 5 password.

{{% figure class="img-responsive" src="/img/natas4_3.png" %}}
