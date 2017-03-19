---
layout: post
title: "Cucumber testing woes - spaces"
date: "2011-08-16T22:47:00-04:00"
comments: true
categories:
 - fail
 - rails
 - cucumber
 - tdd
 - html
---

So I'm working along, writing my tests, and I run into an issue where my Cucumber test is failing. I go to check it out, and see why. This is what I see:

{% img /images/cucumber_fail.png %}

<!-- more -->

I've slightly outlined the relevant data in yellow. I went back, and copy/pasted the data from the creation from my factories, to the expectation of text. It still gave the same error. I was dumbfounded, as I can clearly see the exact same text in my "And I should see" as well as the actual results.

After much googling, and several hours of tinkering, I found the [launchy](http://rubygems.org/gems/launchy) gem. I simply put in my cucumber feature, "Then show me the page". When the test ran, it saved the output from the test to a file, and launched it in my browser. Instantly, I saw my error. Sadly, I had forgotten, that in Html, if you have two or more spaces in a row, it will ignore all but the first, unless they're non-breaking spaces. My test was failing, because I had put two spaces in-between the sentences, and the Html rendered it with only one.
