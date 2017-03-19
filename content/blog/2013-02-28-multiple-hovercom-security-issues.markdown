---
layout: post
title: "Multiple Hover.com Security Issues"
date: "2013-02-28T12:05:00-05:00"
comments: true
categories:
 - rant
 - hover
 - xss
 - security
---

I'm a customer of [Hover](http://www.hover.com) for my domain name needs. However, that will be changing because I don't believe that they take issues seriously.

<!-- more -->

## The first security issue

I was browsing their site, looking for a new domain, and being the constant tinkerer I am, I entered a single quote into the textfield. I noticed an error, and eventually crafted this url:

{% blockquote %}
https://www.hover.com/domains/results?q=%27%3E%3Cscript%3Ealert%28%27xss%27%29%3B%3C%2Fscript%3E
{% endblockquote %}

There's nothing magical in that URL, however it demonstrated a real vulnerability in their code:

{% img /images/hover_original_xss.png %}

From that point, it could be trivial for an attacker to redirect traffic, and steal user sessions, thus being able to purchase domains with someone else's money.

I reported this issue to them, and had an update within 3 days. They had fixed it, and that URL no longer is vulnerable.

## The second security issue

In January, I was discussing Cross-Site Scripting attacks with a coworker, and was talking about the finding I had with [Hover](http://www.hover.com) and how quickly they responded. Upon further investigation, I found that they didn't <i>really</i> fix it, they just put a band-aid on it. I found the following URL was still vulnerable, but it was a little harder to exploit (onMouseOver):

{% blockquote %}
https://www.hover.com/domains/results?q=hi.com%27%20style%3d%27height:10000px%27%20onmouseover%3d%27alert%28%22xss%22%29
{% endblockquote %}

{% img /images/hover_second_xss.png %}

This really depressed me, since I have spent my fair share of time being a developer, and I always tried to actually <i>fix</i>problems, instead of just making the symptom go away. Again, I reported the issue, hoping that I'd get another quick turnaround. I asked them to reply within 30 days to indicate their intent on coordinating efforts for remediation. I waited, but I still have no response from them, and it's been over 30 days. I still can't believe they couldn't even respond with a, "We're working on it", response.

## The billing issue

I received an email from [Hover](http://www.hover.com) about a domain name of mine expiring soon. I went into my account, and saw that the credit card was expired, so I went to update it. Unfortunately, I got this error instead:

{% blockquote %}
Declined by Fraud Service
{% endblockquote %}

{% img /images/hover_fraud.png %}

Now, I figured that it was some sort of error, and tried filling it out a couple more times, verifying my card number was correct.After-all, I was only updating the expiration date, nothing else. Unfortunately, all this resulted in were several temporary one dollar charges on my credit card.

Again, I contacted [Hover](http://www.hover.com) and was disappointed yet again. I stated that I was trying to update my credit card details, and instead they renewed my domain for another year, and said, "it failed when you placed the order, but I was able to renew it on my end". I was a bit upset because I hadn't yet decided if I was going to renew through them or not yet, due to the previous security issues. I replied back that it still wasn't helping me for my other domains that will need renewed at some point, and was given these instructions to help troubleshoot:

1. Use only the first and last name, no middle initial.
2. Change the phone number to numbers only, no hyphens.

The first one was a bit odd, since most credit card processors want your name <i>exactly</i>as it shows on the card. I complied, but it did not help. The second issue I thought was absurd because if their system didn't allow hyphens, why didn't they prevent the user from entering them? This is exactly what javascript validation is for. (Note that they should also validate it on the server-side as well)

Their next steps were to have me call, and give them my credit card number over the phone, and have a billing statement ready to verify every bit of information, as if I've never used a credit card on a website before. It was a bit insulting.

## The 0-day security issue

I had recently read an [article](http://www.skullsecurity.org/blog/2010/stuffing-javascript-into-dns-names) on inserting javascript into DNS to be used for exploitation. I was tinkering with this idea on my own domain names. Unfortunately, I ended up trying to diagnose why none of the DNS records I created in [Hover's](http://www.hover.com) DNS Manager ever made it to their public DNS servers. I'm guessing they have some filtering on the back-end. Eventually I found that their DNS manager was also vulnerable to Cross-Site Scripting:

{% img /images/hover_persistent_xss.png %}

This time, it's a persistent Cross-Site Scripting vulnerability. Every time I navigate to my DNS management screen, I now get a dialog with my cookie. All a user had to do was add a TXT record with the following data:

{% blockquote %}
&lt;img src='https://drupal.org/files/images/sup-dog-magnet-c117515921.jpeg' onload='javascript:alert(document.cookie)\;'&gt;
{% endblockquote %}

They apparently do not even try to filter user-input at all. It's quite depressing.

## Conclusion ([tl;dr](http://www.urbandictionary.com/define.php?term=tl%3Bdr))

[Hover](http://www.hover.com) seems to suffer from the inability to filter user-input. This has become a big problem over the last few years. There are many attacks stemming from this seemingly simple attack. I did my best, and tried reporting to them, but they seem unresponsive, and even when they are, it's not always useful.

I will be moving my domains elsewhere. I haven't yet decided where, and I have a bit of time, but I just don't feel safe keeping my data stored somewhere that can't even stop basic [OWASP Top 10](https://www.owasp.org/index.php/Top_10_2013-T10) vulnerabilities on their main page.
