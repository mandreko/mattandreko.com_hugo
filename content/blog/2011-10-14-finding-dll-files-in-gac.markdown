---
title: "Finding DLL files in the GAC"
date: "2011-10-14T07:20:00-04:00"
comments: true
categories:
 - dotnet
 - gac
 - windows
 - assembly
aliases:
 - "/2011/10/14/finding-dll-files-in-gac"
 - "/2011/10/finding-dll-files-in-gac.html"
---

So last night I was working on a project where I needed a specific version of a .net assembly that was installed somewhere on my system, but I could not locate it by a common search. Whenever I would open up C:\Windows\Assembly\ I could see the file and the multiple versions that I had installed. However, from that window, you can not copy the files out. All I wanted, was to copy the file to my local source branch, and include it in source control.

<!-- more -->

I stumbled upon an [article](http://stackoverflow.com/questions/714907/how-to-extract-an-assembly-from-the-gac/714919#714919) that mentioned being able to go to:

>C:\Windows\Assembly\GAC_msil

This worked out perfectly. I found the assembly, sorted through the version numbers, and copied the dll files that I needed. My app now works marvelously.

I'm guessing that I could also achieve the same results, loading the assembly from the GAC using some sort of assembly binding, but I honestly haven't looked enough into it to figure it out, and I needed these dll files in my source control in case another machine I download it to didn't have the libraries installed, so this method worked fine for me.
