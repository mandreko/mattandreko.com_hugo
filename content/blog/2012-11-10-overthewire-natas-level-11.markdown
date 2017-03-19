---
layout: post
title: "OverTheWire Natas Level 11"
date: "2012-11-10T05:34:00-05:00"
comments: true
categories:
 - overthewire
 - wargames
 - natas
 - php
 - xor
 - hacking
---

[Level 11](http://www.overthewire.org/wargames/natas/natas11.shtml) of the [OverTheWire](http://www.overthewire.org) Natas wargames is a good one. It wasn't one that could instantly be solved either. It involved programming, encryption, and HTTP. All fun!

<!-- more -->

It started with a dialog to set the background color. When you click the "Set Color" button, it sets a cookie in your browser. But as the dialog says, the cookie is protected.

{% img /images/natas11_1.png %}

I looked at the source code, as I always do. It was a little more lengthy than previous levels.

```
&lt;html&gt;
&lt;head&gt;&lt;link&nbsp;rel="stylesheet"&nbsp;type="text/css"&nbsp;href="http://www.overthewire.org/wargames/natas/level.css"&gt;&lt;/head&gt;
&lt;?

$defaultdata&nbsp;=&nbsp;array(&nbsp;"showpassword"=&gt;"no",&nbsp;"bgcolor"=&gt;"#ffffff");

function&nbsp;xor_encrypt($in)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;$key&nbsp;=&nbsp;'&lt;censored&gt;';
&nbsp;&nbsp;&nbsp;&nbsp;$text&nbsp;=&nbsp;$in;
&nbsp;&nbsp;&nbsp;&nbsp;$outText&nbsp;=&nbsp;'';

&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;Iterate&nbsp;through&nbsp;each&nbsp;character
&nbsp;&nbsp;&nbsp;&nbsp;for($i=0;$i&lt;strlen($text);$i++)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;$outText&nbsp;.=&nbsp;$text[$i]&nbsp;^&nbsp;$key[$i&nbsp;%&nbsp;strlen($key)];
&nbsp;&nbsp;&nbsp;&nbsp;}

&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;$outText;
}

function&nbsp;loadData($def)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;global&nbsp;$_COOKIE;
&nbsp;&nbsp;&nbsp;&nbsp;$mydata&nbsp;=&nbsp;$def;
&nbsp;&nbsp;&nbsp;&nbsp;if(array_key_exists("data",&nbsp;$_COOKIE))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;$tempdata&nbsp;=&nbsp;json_decode(xor_encrypt(base64_decode($_COOKIE["data"])),&nbsp;true);
&nbsp;&nbsp;&nbsp;&nbsp;if(is_array($tempdata)&nbsp;&amp;&amp;&nbsp;array_key_exists("showpassword",&nbsp;$tempdata)&nbsp;&amp;&amp;&nbsp;array_key_exists("bgcolor",&nbsp;$tempdata))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(preg_match('/^#(?:[a-f\d]{6})$/i',&nbsp;$tempdata['bgcolor']))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$mydata['showpassword']&nbsp;=&nbsp;$tempdata['showpassword'];
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$mydata['bgcolor']&nbsp;=&nbsp;$tempdata['bgcolor'];
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;$mydata;
}

function&nbsp;saveData($d)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;setcookie("data",&nbsp;base64_encode(xor_encrypt(json_encode($d))));
}

$data&nbsp;=&nbsp;loadData($defaultdata);

if(array_key_exists("bgcolor",$_REQUEST))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(preg_match('/^#(?:[a-f\d]{6})$/i',&nbsp;$_REQUEST['bgcolor']))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$data['bgcolor']&nbsp;=&nbsp;$_REQUEST['bgcolor'];
&nbsp;&nbsp;&nbsp;&nbsp;}
}

saveData($data);



?&gt;

&lt;h1&gt;natas11&lt;/h1&gt;
&lt;div&nbsp;id="content"&gt;
&lt;body&nbsp;style="background:&nbsp;&lt;?=$data['bgcolor']?&gt;;"&gt;
Cookies&nbsp;are&nbsp;protected&nbsp;with&nbsp;XOR&nbsp;encryption&lt;br/&gt;&lt;br/&gt;

&lt;?
if($data["showpassword"]&nbsp;==&nbsp;"yes")&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;print&nbsp;"The&nbsp;password&nbsp;for&nbsp;natas12&nbsp;is&nbsp;&lt;censored&gt;&lt;br&gt;";
}

?&gt;

&lt;form&gt;
Background&nbsp;color:&nbsp;&lt;input&nbsp;name=bgcolor&nbsp;value="&lt;?=$data['bgcolor']?&gt;"&gt;
&lt;input&nbsp;type=submit&nbsp;value="Set&nbsp;color"&gt;
&lt;/form&gt;

&lt;div&nbsp;id="viewsource"&gt;&lt;a&nbsp;href="index-source.html"&gt;View&nbsp;sourcecode&lt;/a&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
```

I viewed my cookie, using the amazing, [Edit This Cookie](https://chrome.google.com/webstore/detail/edit-this-cookie/fngmhnnpilhplaeedifhccceomclgfbg), Chrome extension. Note that the last character is a "=", but it's encoded in the cookie as "%3D" due to encoding.

{% img /images/natas11_2.png %}

I then took this cookie value and figured that maybe I could decode it. XOR encryption is reversible if you know 2/3 parts. You have A XOR KEY = C, for example. If you know A and C, you can derive KEY by XORing A and C together the same way. I ended up writing some code in PHP (since the original was in PHP)

```
&lt;?php

function find_xor_key($decrypted, $encrypted) {
 // This value should be the return of xor_encrypt with a base64 decode
 $base64_decoded = base64_decode($encrypted);

 // Before xoring, get the decrypted value into the same state it was
 $json_encoded = json_encode($decrypted);

 $outText = '';

 for($i=0; $i &lt; strlen($json_encoded); $i++) {
  $outText .= $json_encoded[$i] ^ $base64_decoded[$i % strlen($base64_decoded)];
 } 

 return $outText;
}

$cookie = array("showpassword"=&gt;"no", "bgcolor"=&gt;"#ffffff");

$key = find_xor_key($cookie, "ClVLIh4ASCsCBE8lAxMacFMZV2hdVVotEhhUJQNVAmhSEV4sFxFeaAw=") . "\n";

print "XOR Key: " . $key . "\n";

?&gt;
```

When ran, this produces the following. 

```
mandreko$ php natas11_decode.php 
XOR Key: qw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jq
```

So now I know that the XOR key is "qw8J".  It's repeated over and over, because the string it's encoding is longer than the key, so it gets repeated, otherwise it'd be XOR to nothing.

I then took this XOR key and tried to use it to encode a new cookie value, so that I could switch the "showpassword" value to "yes".  I wrote the following script to do so. 

```
&lt;?php

function&nbsp;custom_xor($key,&nbsp;$in)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$outText&nbsp;=&nbsp;'';
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for($i&nbsp;=&nbsp;0;&nbsp;$i&nbsp;&lt;&nbsp;strlen($in);&nbsp;$i++)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$outText&nbsp;.=&nbsp;$in[$i]&nbsp;^&nbsp;$key[$i&nbsp;%&nbsp;strlen($key)];
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;$outText;
}

$cookie&nbsp;=&nbsp;array("showpassword"=&gt;"yes",&nbsp;"bgcolor"=&gt;"#ffffff");
$key&nbsp;=&nbsp;"qw8J";

print&nbsp;"New&nbsp;Cookie&nbsp;Value:&nbsp;"&nbsp;.&nbsp;base64_encode(custom_xor($key,&nbsp;json_encode($cookie)))&nbsp;.&nbsp;"\n";

?&gt;
```

When ran, it produced the following. 

```
mandreko$ php natas11_encode.php 
New Cookie Value: ClVLIh4ASCsCBE8lAxMacFMOXTlTWxooFhRXJh4FGnBTVF4sFxFeLFMK
```

I then pasted that cookie value into my Edit This Cookie extension, and refreshed the page.  It then presented me with the password to the next level. 

{% img /images/natas11_3.png %}
