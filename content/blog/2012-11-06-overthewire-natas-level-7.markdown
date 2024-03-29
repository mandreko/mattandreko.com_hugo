---
title: "OverTheWire Natas Level 7"
date: "2012-11-06T05:32:00-05:00"
comments: true
highlight: "true"
categories:
 - directorytraversal
 - overthewire
 - wargames
 - natas
 - hacking
aliases:
 - "/2012/11/03/overthewire-natas-level-7"
 - "/2012/11/overthewire-natas-level-7.html"
---

Finally, with level 7 of OverTheWire's Natas wargame, we start to get to more "real world" vulnerabilities. It's still very easy, but it's at least getting better.

<!-- more -->

We start with a single page, that has 2 navigation links.

{{% figure class="img-responsive" src="/img/natas7_1.png" %}}

I noted that the URLs had a "page=" parameter. I thought maybe this would be the file it was including. Viewing the source gave a nice reminder of where the password for the next level would be stored.

{{% figure class="img-responsive" src="/img/natas7_2.png" %}}

I then tried a directory traversal exploit, pointing to the password file for the next level. It successfully displayed the password.

{{% figure class="img-responsive" src="/img/natas7_3.png" %}}
