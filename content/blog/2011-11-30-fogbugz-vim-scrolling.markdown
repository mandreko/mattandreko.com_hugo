---
title: "Fogbugz VIM Scrolling"
date: "2011-11-30T06:24:00-05:00"
comments: true
highlight: "true"
categories:
 - userscript
 - vim
 - greasemonkey
 - fogbugz
---

At [work](http://www.leafsoftwaresolutions.com), we use [FogBugz](http://www.fogcreek.com/fogbugz) for our trouble tickets, and internal tracking. We sometimes have some really long cases, so to make it easier to navigate through them, we wanted to be able to push a button to go to the next action event on the ticket.

<!-- more -->

I started writing a [GreaseMonkey](http://en.wikipedia.org/wiki/Greasemonkey) userscript, and with some suggestions from coworkers, made one that used the vim up and down navigation keys (j and k) to navigate and highlight through all the action events.

If you'd like to try it out for yourself, you should be able to install it from [here](https://userscripts.org/scripts/review/120404). (note that you must have GreaseMonkey support in your browser. I use [TamperMonkey](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo) in Chrome.)

[UPDATE 2011-12-13]
I made a fix to make it work when a case had changesets committed, which would previously make the scrolling mess up.
