---
title: "OverTheWire Natas Level 9"
date: "2012-11-08T06:12:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - commandinjection
 - natas
 - hacking
aliases:
 - "/2012/11/07/overthewire-natas-level-9"
 - "/2012/11/overthewire-natas-level-9.html"
---

The next level of [OverTheWire's](http://www.overthewire.org) Nata challenge is [Level 9](http://www.overthewire.org/wargames/natas/natas9.shtml). This is a command injection vulnerability.

<!-- more -->

Initially, you are given a search box.

{{% figure class="img-responsive" src="/img/natas9_1.png" %}}

Just like in previous levels, I looked at the available source code. You can see the vulnerability is that the user input is not sanitized. Due to this, you can inject code into the "grep" command it is running to do the search.

{{% figure class="img-responsive" src="/img/natas9_2.png" %}}

I simply put in the search box, "; cat /etc/natas_webpass/natas10", since that is where the password file is located. The command it ends up running is "grep -i; cat /etc/natas_webpass/natas10dictionary.txt". The semi-colon terminates the "grep" command, and allows the "cat" to then run next. I end up passing in the password file, as well as the dictionary. In some cases, you may need to end the line with a comment, to keep it from executing, by putting in a "#". Regardless, after running, you get the password to the next level.

{{% figure class="img-responsive" src="/img/natas9_3.png" %}}
