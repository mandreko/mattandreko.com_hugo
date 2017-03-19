---
title: "Sysax 5.64 HTTP Remote Buffer Overflow"
date: "2012-07-28T22:56:00-04:00"
comments: true
highlight: "true"
categories:
 - rop
 - windows
 - sysax
 - exploit
 - hacking
 - metasploit
---

I have discovered a bug in the [Sysax Multi-Server application](http://sysax.com/server/index.htm). More specifically, it's in the HTTP File Server service, which is not enabled by default. It has to be turned on by the admin for this exploit to properly function. The user in question also needs permission to create a directory. 

<!-- more -->

In the Sysax service, the configuration would look like this:

{{% figure class="img-responsive" src="/img/sysax_5.64_protocols.png" %}}

To trigger this vulnerability is pretty simple. Log into the HTTP File Server:

{{% figure class="img-responsive" src="/img/sysax_5.64_login.png" %}}

After logging in, click the "Create Folder" link:

{{% figure class="img-responsive" src="/img/sysax_5.64_main.png" %}}

In the "Folder Name" textbox, enter 1000 "A"s:

{{% figure class="img-responsive" src="/img/sysax_5.64_create_folder.png" %}}

The service will then crash, and have the EIP address overwritten:

{{% figure class="img-responsive" src="/img/sysax_5.64_crash.png" %}}

I reported this vulnerability to CodeOrigin, the creators of the Sysax Multi-Server on July 26 17:24 PM EDT. Surprisingly, they got back to me at July 27 04:28 AM PDT with a new version available (5.65).  Unfortunately this version had the same vulnerability, although the EIP offset was different. After reporting this, they got back to me again at July 28 06:59 AM PDT, stating that a new version was available (5.66). This new version appears to have the vulnerability fixed.

If you're using Sysax Multi-Server, please upgrade, to prevent attackers from infiltrating your systems.

The exploit can now be found on exploit-db, [here](http://www.exploit-db.com/exploits/20676), where you can also download the vulnerable version of the software.

Thanks a bunch to [@cd1zz](https://twitter.com/cd1zz) and [@iMulitia](https://twitter.com/iMulitia) for pointing me to this app!


UPDATE (2012-08-19): The original exploit had an issue with a variable EIP offset, due to the fact that the root folder for the user was part of the stack.  I was able to discover a second vulnerability to get the server to disclose the path.  This has been incorporated into the new exploit, and works much better.  Sysax has released an updated version that is no longer vulnerable to this.
