---
layout: post
title: "PWB Progress and Impressions"
date: "2012-03-27T16:45:00-04:00"
comments: true
categories:
 - pwb
 - offsec
 - hacking
---

I recently decided to take [Offensive Security's course, Penetration Testing with Backtrack](http://www.offensive-security.com/information-security-training/penetration-testing-with-backtrack/).  I'm now 30 days in, of my 90 day allotment.  I figured I would share my impressions and what I've learned up to now, without being specific enough to give anything away to future students. 

<!-- more -->

## The Wait

So I decided to take the class, and submitted the order on February 16th 2012.  Offensive Security starts new classes each Sunday, and apparently the one starting on February 18th was already full, so I ended up waiting until February 25th.  The waiting was agonizing.  I wanted to get started <b>now</b>.  But alas, I waited my time. 

## The Beginning

So on February 25th 00:00:00 GMT (7PM on February 24th for me), I received the email from Offensive Security with my credentials to the lab, and coursework.  I started downloading the PDF and videos on one computer, while quickly setting up the VPN connection on my laptop's BackTrack 5 R1 virtual machine.   

So excited to finally be started, I spent the next 5 hours watching the video series that came with the course.  I followed along with it, for the most part, duplicating what was done.  I went to bed, and woke up the next day to return to it.  I watched several more hours of video, skipping a few sections that I already felt really strong with.  I then started looking through the PDF, and found that I was going to need to "show my work" on all of those video examples and more.  I was a bit frustrated that I had jumped right in, instead of looking over things first.  That was just me being overly excited. 

## And we're off...

I originally was going to try to first do the PDF requirements along with the videos, and then play in the labs, however again, my excitement won out.  I connected to the labs, and started ping scanning, port scanning, and all the usual stuff one would do when discovering a network.  I started mapping out what I had access to, and gathering data on what was running.  By the evening of February 26th, I already had broken into 3 of the lab machines.  On March 1st, I had 9 machines.  On March 5th, I reported to my friends that I had 17 machines.  I felt amazing, I was just flying through them.   

Eventually, I slowed down.  I was no longer getting several machines at a time.  I'd still have the random bursts though.  I spent all night on March 15th working on them, and somehow got another 4 machines.  Only a few days later, I had all the machines in the student lab, except Sufference, a machine notorious for being one of the most difficult in the lab.  I had even managed to get Pain, another one of the notoriously difficult ones.  I started finally getting to the point where I couldn't get a machine after just an hour or two, and then really was having fun. 

## Some things I learned along the way

* From the advice of several friends, I started keeping wordlists that I made myself, as I went along.  (I learned this lesson on some sample virtual machines that I had previously completed when trying to prepare for the course.)
* Brute forcing passwords over a VPN is slow.
* Don't just hack and dash.  There is often something useful on a machine, if you just spend the time looking.  Things like, "find / | grep '\(txt\|zip\)$'", will become your friend.
* Pay attention to g0tmi1k's excellent [linux privilege escalation page](http://g0tmi1k.blogspot.com/2011/08/basic-linux-privilege-escalation.html) He wrote it while doing PWB, because some of the machines were tricky.
* Keep up to date on new pentesting methods.  Often times, new things come out which may prove to be useful in a lab that was not created in the last couple weeks.
* Do not overestimate the fact that users will make things easy on you.  They'll use their first name as a login often. They'll keep default passwords. They will use short passwords that are easily cracked.
* Do not ask for hints.  You will not be given hints on real jobs.  [Try Harder](http://www.offensive-security.com/when-things-get-tough/)

## Still more work ahead

As of today, I have written up my notes on how to root all but 3 machines in the lab.  I technically have root on those 3, due to a method I discovered, but don't like as my final method.  After I get those last 3 the "right" way, learning the lessons that Offensive Security wanted me to, I'll go back to my PDF file, and doing the reporting work.  I'm not particularly looking forward to this part, but it's part of the course, and part of the job as a penetration tester.  It's what the clients pay you for. 

In talking with my friends, who are already OSCP certified, most seem to think I'm flying through the lab quite fast.  This makes me feel a bit less nervous about the exam.  I haven't yet figured out when I'll take it, but I think I'll do ok. 

## Final Thoughts

For anyone looking to get into penetration testing, or anyone that just enjoys this stuff as a hobby, I'd very much recommend this course.  I'd heard so many good things about it before I started, and I now can help say good things about it as a student.  The PDF/Video coursework is a good start, but the lab is simply amazing.  I often see people posting in #offsec about wishing to be able to go back to the lab to play some more.  I already see improvements in my skills, especially the enumeration and gathering skills.  I will definitely try to get into [Cracking The Perimeter](http://www.offensive-security.com/information-security-training/cracking-the-perimeter/) next.
