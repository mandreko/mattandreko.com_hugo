---
title: "Poor UI Experience"
date: "2011-08-17T08:23:00-04:00"
comments: true
categories:
 - browsers
 - testing
 - ui
aliases:
 - "/2011/08/poor-ui-experience.html"
---

I was recently signing up for [about.me](http://about.me) because it sounded like a neat little simple blurb about yourself. When trying to sign up, after entering my email address, and password, I was brought to a page asking for some basic info. However, I couldn't figure out how to submit it. I was given this error:

{{% figure class="img-responsive" src="/img/about.me_validation_error.png" %}}

<!-- more -->

I filled out all the required data, and left the optional parts empty. However, it wouldn't submit. So then, I tried entering a short bit of information in the optional parts, and still got the same error. I tried multiple times, I even shut down my browser and went back to the site. Eventually, I switched from Chrome to Internet Explorer, and it let me continue.

Now when you look at this experience, you see that it's fairly trivial. However, the audience that they are targeting, may not be the mostsavvy when it comes to computers. Half the non-technical people I talk to, don't even know what their browser is, and surely wouldn't know that this error was an issue with one browser over another.

I run into this issue quite often in development, and I know that I have to test it in all major browsers. All browsers need to work, or I won't succeed. Had I not switched browsers, I would have not been able to finish signing up for an account. While this is just a social site, what if it were a bank, or something important? You absolutely have to test for this sort of thing.
