---
title: "Sprint iPhone 4S pre-order fiasco"
date: "2011-10-07T08:09:00-04:00"
comments: true
categories:
 - rant
 - fail
 - ui
 - sprint
 - iphone
---

So like many people, I wanted the new iPhone 4S.  Since the wife unit is on Sprint, and I'm on AT&T, we started looking at plans.  Sprint offers a nicer family plan and lets her upgrade to a smartphone, while letting me have the iPhone.  So we decided to make the switch, and do the pre-order.  I called last night to verify the ordering process, and make sure that I could still get the $200 price while not using her upgrade credit.  I was told that the phone would become available at 12:01 AM PST.  I woke up at 5 AM (No way am I waking up at 3 AM) to put in the pre-order.  I tried clicking the massive preorder button: 

{{% figure class="img-responsive" src="/img/sprint_1.png" %}}

<!-- more -->

When I did this though, it was trying to replace my wife's phone with the iPhone. This was not cool.

I log out, close my browser and try again. This time I go to "My Account", and select "Add a new phone to share minutes". When I did this, I could add a new phone, but we couldn't seem to get it with the family plan setup.

I log out, close my browser and try again. This time I go to "Shop", and select "Plans". I select the family plan that we want. It instructs me to add a phone, so I select the iPhone 4S. It then tells me that I need to add a second plan. It doesn't let me use her existing phone anywhere.

I decide that maybe I'll stop trying to be such a technology zealot and try using an actual phone. I call them up, and their callcenters aren't open. Apparently they don't open until 6 AM CST. I wait until then in my car, and then call them. After finding out that my wife didn't know her correct security pin or security answer, I had them send it to her email. I checked her email from my phone (something I won't be able to do with the Sprint iPhone unfortunately), and found the answers. The security pin was way off, but the security answer was pretty much what I told the Sprint representative. I just gave an unabbreviated version. Unfortunately they don't get to see the security answer to compare to, they type in what you tell them, and the computer compares it. So if it's off by just a little bit, it's not letting you in. Awesome. 

I give the representative the pin, and he lets me access her account. I tell him about wanting to pre-order the iPhone 4S, and my problems with the website. He asks me to try again, which unfortunately I can't do, since I'm in my car. He puts me on hold for a few minutes, and tells me that there's some sort of problem, that they can't order the iPhone 4S yet, and maybe I should "try back in a few hours". I explain that I'll be at work, and not able to just spend all day calling until their ordering system decides to work. He says, "Well, maybe too many people are ordering right now, so I can't order. Try it online again." He tells me because of my issues with the website, to just order the phone under my wife's account, but under an individual plan. I ask about number porting, and he said that Sprint could assign it a number, and then when it's delivered, and I open the box, they can port my AT&T number over. They could then fix the plan to be a family plan. I asked, and he confirmed that there would be no cost penalty for this.

So I go to work, and quickly start to pre-order the phone, as to not waste a bunch of work time. I get to ordering under the individual plan, and they ask about porting the number. The representative said they wouldn't need it, but I figured since they ask, I'll enter it, and have it ready. Awesome for me! Then I see this:

{{% figure class="img-responsive" src="/img/sprint_security.png" %}}

I've highlighted the parts that worry me. Firstly, notice that for some reason now, my browser is warning me that there's an issue with the security. I'm smart enough to figure out what it is luckily, since I work in the IT field. The encryption is working, they just have an HTTPS page that has images on it referencing HTTP. This is considered a no-no in web programming. Then the more alarming issue: They want my account number, password, and SSN for AT&T. I could see using my account number as a reference for talking with AT&T, no problem. However why do they need my password? We have always taught users to NEVER give out your password to anyone, especially on a page that the HTTPS isn't working properly. Since the representative said they could assign it the new number and port on delivery, I opted for the option to assign me a new number instead of filling out this form.

Eventually I get to this point:

{{% figure class="img-responsive" src="/img/sprint_complete.png" %}}

Let's hope that Sprint can actually deliver on their promise of fixing everything. Everyone likes to complain about AT&T being incompetent, but so far, I'm not really having that much confidence in Sprint either. We'll just have to see what happens.

As for the security issues on their page, Sprint should know better. Or at least the techs they paid to do the work should know better. There's no reason that shouldn't have been caught in testing.
