---
layout: post
title: "PWB Conclusions and the Future"
date: "2012-06-24T17:41:00-04:00"
comments: true
categories:
 - pwcrack
 - rails
 - pwb
 - ctp
 - future
 - hacking
---

The results
-----------

As I posted previously, I was taking the [PWB](http://www.offensive-security.com/information-security-training/penetration-testing-with-backtrack/) course from [Offensive Security](http://www.offensive-security.com). I am happy to report that I passed with flying colors (100%)! This is the best email I've ever received: 

{% img /images/pwb_course_pass.png %}

<!-- more -->

Advice for new students
-----------------------

During the course, I learned several things, including many things about myself. 
* Do the PDF/Video work first. If you wait until the end, you will hate your life. It's so droll and boring. At least if you do it as you go, it won't be as bad.
* If you've never done pentest reports before, as I hadn't, leave plenty of time. They do take a while more than you think.</li><li>As you're breaking into machines, take screenshots as you go. I unfortunately captured the text on the screens as I went along, and because the report requires screenshots, you'll find yourself hacking every machine a second time.
* During the course and the exam, it's super important to take breaks. For example, after hacking all the machines in the lab, I took 1-2 weeks off of the class, to spend time with my wife.  During the exam, I worked for the first 18 hours, then slept for 4, and woke up in time to finish the last machine.  A refreshed mind is <b>super</b> important!

What's next?
------------

I was super lucky.  I talked to my employer, [Leaf Software Solutions](http://www.leafsoftwaresolutions.com), who reimbursed me for the PWB class.  I was originally just doing it for the fun.  Now my work is paying for me to have fun! Next on the list for me, will be the [CTP](http://www.offensive-security.com/information-security-training/cracking-the-perimeter/) course (for the OSCE certification).  However, this probably won't be for a bit, maybe not until next year. This is simply due to the patience of my wife, who waited on me for 3 months to finish the last course, spending every evening alone. We're in no hurry to do that again, but eventually will.  In the meantime, I've been working on a few fun projects: 

Metasploit Post modules, such as iPhone enumeration
---------------------------------------------------

Thanks g0tmi1k for the idea! All the phone numbers are blacked out, for the protection of my friends and family. 

{% img /images/iphone_screenshot_2.png %}

Password Cracking Web GUI
-------------------------

https://github.com/mandreko/pwcrack-webgui
This is a project for me to tinker more with Ruby on Rails and password cracking.  The main idea, is to take all of the leaks that I've been archiving for some time now, and crack them all at once, instead of running the same wordlists and rules through every one in serial. I plan on storing all all the hashes in a MongoDB database, and then I can, for example, dump all MD5 hashes that are currently uncracked, making one big super-leak. Then, once complete, it'll update the MongoDB database. 
I have tons of fun ideas on this project, but development is slow, as rails is not my primary language. It's more of my tinker project.  Feel free to fork it if you want to make it better. 
