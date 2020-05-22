---
title: "OverTheWire Natas Level 3"
date: "2012-11-02T06:54:00-04:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - html
 - hacking
aliases:
 - "/2012/11/01/overthewire-natas-level-3"
 - "/2012/11/03/overthewire-natas-level-3"
 - "/2012/11/overthewire-natas-level-3.html"
---

Continuing on with Level 3 of OverTheWire's Natas wargame, I found the first page, like previous levels, saying that there was nothing on the page.

<!-- more -->

{{% figure class="img-responsive" src="/img/natas3_1.png" %}}

I viewed the source and saw the strange comment about "Not even Google will find it".

{{% figure class="img-responsive" src="/img/natas3_2.png" %}}

After thinking about that for a minute, it clicked that maybe it was because of a "robots.txt" file, which would prevent search engines from finding any files. I then browsed to the "robots.txt" file.

{{% figure class="img-responsive" src="/img/natas3_3.png" %}}

Inside the "robots.txt" file, it shows a directory that it has asked to not be indexed by search engines. I then navigated to that folder, and found a "users.txt" file.

{{% figure class="img-responsive" src="/img/natas3_4.png" %}}

Lucky for me, the "users.txt" file, contained the next level's credentials.

{{% figure class="img-responsive" src="/img/natas3_5.png" %}}
