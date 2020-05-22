---
title: "OverTheWire Natas Level 6"
date: "2012-11-05T05:12:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - includes
 - hacking
aliases:
 - "/2012/11/04/overthewire-natas-level-6"
 - "/2012/11/overthewire-natas-level-6.html"
---

The [6th level](http://www.overthewire.org/wargames/natas/natas6.shtml) of the [OverTheWire](http://www.overthewire.org) Natas wargame starts introducing us to PHP and server configuration issues.

<!-- more -->

It starts out with a secret password prompt.

{{% figure class="img-responsive" src="/img/natas6_1.png" %}}

I took a look at the sourcecode, via the link provided.

{{% figure class="img-responsive" src="/img/natas6_2.png" %}}

I decided I would try and see if I could request the "secret.inc" file, and it worked perfectly.

{{% figure class="img-responsive" src="/img/natas6_3.png" %}}

After I put in the secret value into the input box, it showed me the password for the next level.

{{% figure class="img-responsive" src="/img/natas6_4.png" %}}

This level teaches that files that contain secrets should never be publicly accessible. Either put them in server-side code so that they're not rendered, or put them out of the webroot.
