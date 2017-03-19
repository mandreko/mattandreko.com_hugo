---
title: "OverTheWire Natas Level 14"
date: "2012-11-13T05:08:00-05:00"
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

The next level of the [OverTheWire](http://www.overthewire.org) Natas wargame is [Level 14](http://www.overthewire.org/wargames/natas/natas14.shtml), which introduces [SQL Injection](https://www.owasp.org/index.php/SQL_Injection), a very popular subject as of late.

<!-- more -->

The level starts out with a login dialog.

{{% figure class="img-responsive" src="/img/natas14_1.png" %}}

The source code is fairly straight forward. It's doing a basic authentication query. It however, does have a handy "debug" flag, that if set, will print the query used to the screen. 

```
<html> 
<head><link rel="stylesheet" type="text/css" href="http://www.overthewire.org/wargames/natas/level.css"></head> 
<body> 
<h1>natas14</h1> 
<div id="content"> 
<? 
if(array_key_exists("username", $_REQUEST)) { 
    $link = mysql_connect('localhost', 'natas14', '<censored>'); 
    mysql_select_db('natas14', $link); 
     
    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\" and password=\"".$_REQUEST["password"]."\"";
    if(array_key_exists("debug", $_GET)) { 
        echo "Executing query: $query<br>"; 
    } 

    if(mysql_num_rows(mysql_query($query, $link)) > 0) { 
            echo "Successful login! The password for natas15 is <censored><br>"; 
    } else { 
            echo "Access denied!<br>"; 
    } 
    mysql_close($link); 
} else { 
?> 

<form action="index.php" method="POST"> 
Username: <input name="username"><br> 
Password: <input name="password"><br> 
<input type="submit" value="Login" /> 
</form> 
<? } ?> 
<div id="viewsource"><a href="index-source.html">View sourcecode</a></div> 
</div> 
</body> 
</html> 
```

I simply appended the URL with the parameters I wanted. I set the "debug" flag to a true value, and put in a junk username and password.

{{% figure class="img-responsive" src="/img/natas14_2.png" %}}

Since that showed me what query was being ran, I modified it to inject some code (" or 1=1 -- ) to return all rows in the table, guaranteeing that at least one entry would show up. This ends up changing the SQL query to do a comparison based on username, OR where 1=1, which is always true. After that, the "-- " simply comments out the rest of the query, so that no issues arise from stuff later on. Make sure to have a space after the dashes, else it may not work. Once everything was completed, it showed me the password to the next level.

{{% figure class="img-responsive" src="/img/natas14_3.png" %}}
