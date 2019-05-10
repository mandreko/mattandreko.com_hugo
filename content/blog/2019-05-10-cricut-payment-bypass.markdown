---
title: "Cricut Payment Bypass Vulnerability"
linktitle: Cricut Payment Bypass Vulnerability
date: 2019-05-10T14:50:25-04:00
highlight: "true"
featured_image: cricut_hack_the_planet.png
categories:
- webapp
- hacking
- spa
- exploit
---

Last year during Black Friday, I bought a [Cricut Explore Air 2](https://amzn.to/2DZwXaC) to make custom stickers, tshirts, and what not. Due to the fact that I like 3D printing and other CNC devices, it seemed right up my alley. Being the security enthusiast that I am, I couldn't help but look at their site as it was in my browser. What I found was surprising.

<!-- more -->

### Background

[Cricut](https://home.cricut.com/) is a brand of home die-cutting machines. The company appears to be owned or partnered with Provo Craft & Novelty Inc. They have a variety of systems which let you cut, fold, press, etc various materials, most notably vinyl and paper. Many crafters use them to make iron-on tshirts, or vinyl stickers for cups, car windows, etc. 

### Curiosity killed the cat

In the [Cricut Designer](https://design.cricut.com), you can do a ton of things for free. However, if you want some premium shapes, projects, fonts, etc, you can pay for them. For example, here is a shirt design which costs $7.96 to buy everything.

{{% figure class="img-responsive" src="/img/cricut_paid_design.png#center" %}}

You can see that this is broken down into multiple items. In this example, there's a $0.99 dinosaur shape, a $0.99 bunny shape, a $0.99 greeting card phrase, and a $4.99 font.

{{% figure class="img-responsive" src="/img/cricut_paid_breakdown.png#center" %}}

You can import this project into the Cricut Designer, customize it however you want, but you only pay when you actually go to make the project. This got me thinking.

### Client side validation woes

I've spent a lot of time developing web applications in the past. I find that a common theme is lack of validation between client and server. Or more rather enforcement of validation if client-side is disabled. So I attempted to try it.

I started by choosing a project that would require payment. This Luke Skywalker vinyl cutout would do nicely.

{{% figure class="img-responsive" src="/img/cricut_non_free_project.PNG" %}}

When I went to actually make the cutout, you can see that where normally you sould see a "Continue" button, there was now a "Purchase" one instead.

{{% figure class="img-responsive" src="/img/cricut_non_free_payment.PNG" %}}

I noticed that the site was written in [Angular](https://angular.io/), which uses the idea of controllers to keep state of the UI. When I inspected the free "Continue" button, I saw that it called the "go()" function on the "ctrlMatFooter" controller. 

{{% figure class="img-responsive" src="/img/cricut_continue_go_button.PNG" %}}

When I went through the purchasing route, I looked to see if I could just manually call that function, although I did have to add some code to get a reference to the controller in scope.

{{% figure class="img-responsive" src="/img/cricut_run_angular_code.PNG" %}}

Once that was ran, the Cricut Designer got past the point of requiring payment, and let me load my material. I then just hit the cut button on the physical device, and off it went.

{{% figure class="img-responsive" src="/img/cricut_bypass_cutting.PNG" %}}

### Root cause

The issue I was able to identify was a payment bypass. This could prove to be damaging to Cricut if people used it all the time, as they likely rely on the money brought from those projects to pay their development staff and more. 

The issue was simply that the Cricut Designer assumed that the "Purchase" dialog would only be closed if a purchase was actually made. There was no validation in the "go()" method to ensure that all the designs were owned before actually sending it to the device.

### Disclosure

I'm a big fan of responsible disclosure when companies are open to it. I reached out a couple ways when I found this bug. I tried emailing them, and then using their live-chat capabilities. I requested to speak to a developer or security contact. They mentioned on the live-chat that they could relay a message to the developers for me. I tried to be vague about the details of the vulnerability, but enough to let them know it was important. I basically mentioned that it was possible to bypass their payment gateway and get everything in their digital store for free.

I didn't expect to hear much, but within 24 hours I had a developer call me up. I spoke to him about the details, and had a really good feeling that they actually cared about their project. I sent him an email detailing the instructions to reproduce, and various information. 

I kept in touch with the developer there, as I typically put a date that if I don't hear from them, I publicly disclose. He set good expectations, and although it was more than the typical 30 days that I wait, it wasn't much longer before the issue was fixed. 

The disclosure timeline was as follows:

* Nov 27, 2018 - Initial outreach via email & live-chat
* Nov 28, 2018 - Cricut called my cell phone, and I emailed details
* Nov 29, 2018 - Cricut confirmed vulnerability and added it to January roadmap
* Jan 7, 2019 - Cricut stated fix was planned within a week
* Jan 10, 2019 - Fix published

### Non-Bounty Rewards

During the discussions with the Cricut developer, I asked if they had any sort of bug bounty. He said no, so I told him that they should at least consider setting something up like that. It's a great way to get transparency and good bugs found.

Even though they didn't have a bug bounty, the developer did reach out asking if there was anything from the Cricut store that I wanted. I ended up getting all sorts of Cricut products, and upgrading my current machine to their top-of-the-line model.

{{% figure class="img-responsive" src="/img/cricut_bounty_rewards.jpg" %}}

### Where to go from there?

Since this bug finding, I've been looking into their products a bit more. I like this company, and I like their products. I enjoyed working with their developer, so I will keep doing so. I've already reported at least 2 more bugs, which have not yet been fixed. Once they are, I will likely have another post detailing them.
