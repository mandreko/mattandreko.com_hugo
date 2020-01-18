---
title: "Renewing KeyBase and GnuPG Keys"
linktitle: Renewing KeyBase and GnuPG Key
date: 2020-01-18T13:11:25-04:00
highlight: "true"
featured_image: renew_keybase_gnupg_keys_featured_image.png
categories:
- gnupg
- keys
---

Every year or two, my [GnuPG](https://gnupg.org/) keys expire on [KeyBase](https://keybase.io/mandreko) and in various key servers. Every time, I forget the process, and have to re-learn it. This post serves as a reminder to myself, or anyone else trying to do the same thing. It's trivially easy, and there are GUI applications which can do it for you, but I went with this solution, since everyone should be able to do it.

<!-- more -->

## Setup

When I created my [KeyBase](https://keybase.io) account, I utilized a key pair that I had already been using. I don't know if this works if you had KeyBase [KeyBase](https://keybase.io) generate your key for you, but I suspect it would.

To run [GnuPG](https://gnupg.org/), you need to install it first. I was on a Microsoft Windows 10 system, so I just used Ubuntu as part of the [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10). It has mostly replaced my need for virtual machines on my personal desktop, and it integrates well into Windows 10. If your Ubuntu [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) system does not come with [GnuPG](https://gnupg.org/) already installed, you can install it by running:

```
sudo apt install gnupg
```

## On to the keys

Since the [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) system may not have your key pair installed, as mine didn't, you may have to get them imported into [GnuPG](https://gnupg.org/). If you already have your key pair in [GnuPG](https://gnupg.org/) just skip ahead.

### Importing the Public Key

First, I downloaded the public key. This is the command given when you click on anyone's public key on [KeyBase](https://keybase.io). 

```
curl https://keybase.io/&lt;your_username&gt;/pgp_keys.asc | gpg --import
```

{{% figure class="img-responsive" src="/img/0_import_public_key.png#center" %}}

### Importing the Private Key

I didn't have my private key on this system, so I downloaded it straight from [KeyBase](https://keybase.io). If you're logged in, and view your own profile, you should have an "edit" button with an option to export your private key. (You'll likely be prompted for your [KeyBase](https://keybase.io) password to perform this action)

{{% figure class="img-responsive" src="/img/1_export_private_key_from_keybase.png#center" %}}

Save this file somewhere that the [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) system can see. You'll then want to import it onto [GnuPG](https://gnupg.org/) on the [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) system using the following command:

```
gpg --import &lt;downloaded_file&gt;.key
```

{{% figure class="img-responsive" src="/img/2_import_private_key.png#center" %}}

Once you start this import, it's going to ask you for the password to the key. This one took me a while, because I thought it would be the same password that I originally used to import it years ago. However, this key is encrypted with your [KeyBase](https://keybase.io) password! Copy your [KeyBase](https://keybase.io) password from your password vault, and paste it into the [GnuPG](https://gnupg.org/) dialog.

{{% figure class="img-responsive" src="/img/3_password_to_import_private_key.png#center" %}}

### Verification

Before continuing, make sure that both your keys were imported properly. You should be able to see them if you run:

```
gpg --list-keys
gpg --list-secret-keys
```

{{% figure class="img-responsive" src="/img/4_list_keys_after_importing.png#center" %}}

### Editing the Keys

To begin editing these keys' expiration dates, enter the edit mode of [GnuPG](https://gnupg.org/), passing it your key's fingerprint value:

```
gpg --edit-key &lt;your_key_fingerprint&gt;
```
{{% figure class="img-responsive" src="/img/5_edit_key.png#center" %}}

From here, you can list any potential subkeys that you may have. I have subkeys for each of my email addresses, so that I can use this same [GnuPG](https://gnupg.org/) identity with any of the email addresses. Yours may not have as many listed.

```
gpg> list
```

{{% figure class="img-responsive" src="/img/6_list_subkeys.png#center" %}}

First, let's change the expiration on the private key by entering the "expire" command:

```
gpg> expire
```

Then it will prompt you to change the expiration date. I specified 2 years this time, but you can choose anything you want, even a key that does not expire, although that has it's own issues.

{{% figure class="img-responsive" src="/img/7_expire_command.png#center" %}}

To make this change, [GnuPG](https://gnupg.org/) will then prompt you for your password again. Remember, if you exported it from [KeyBase](https://keybase.io), this will be your [KeyBase](https://keybase.io) password. 

{{% figure class="img-responsive" src="/img/8_password_to_set_expiration.png#center" %}}

[GnuPG](https://gnupg.org/) will return to list you the keys, where you can see that your private key is now showing an updated expiration date. 

{{% figure class="img-responsive" src="/img/9_keys_with_new_expiration.png#center" %}}

However the public key is still with the old date. The process is exactly the same as the private key, except we just need to select the public key first. Select it by using the following command:

```
gpg> key 1
```

Note that if you need to make additional changes to your secret key, you can select it again with:
```
gpg> key 0
```

{{% figure class="img-responsive" src="/img/10_select_subkey.png#center" %}}

Once again, enter the "expire" command and set an expiration date:

{{% figure class="img-responsive" src="/img/11_expire_subkey_command.png#center" %}}

Lastly, remember to persist these changes to disk with the "save" command:

```
gpg> save
```

{{% figure class="img-responsive" src="/img/12_save.png#center" %}}

Additionally, you can export the new public key to a file:

{{% figure class="img-responsive" src="/img/13_export_key_to_file.png#center" %}}

### Updating KeyServers

After updating your keys, you will want to distribute your new public key. I always send mine to the MIT keyserver, as it's commonly searched. You can do it directly through [GnuPG](https://gnupg.org/):

```
gpg --keyserver pgp.mit.edu --send-keys &lt;your_key_fingerprint&gt;
```

{{% figure class="img-responsive" src="/img/14_key_sent_to_keyserver.png#center" %}}

Shortly after, you can view it on the MIT Keyserver site. It should have your new expiration date listed.

{{% figure class="img-responsive" src="/img/15_key_on_keyserver_with_updated_expiration.png#center" %}}

### Updating KeyBase

If you used [KeyBase](https://keybase.io) to start with, you'd ideally want to upload it to them as well. Login to [KeyBase](https://keybase.io), and go to your profile. There should be an "edit" link with an option to "Update my key (I edited it elsewhere)". Click this link.

{{% figure class="img-responsive" src="/img/16_update_key_on_keybase.png#center" %}}

This will allow you to enter your public key. Open the file that you exported earlier, and copy the contents out of it, and put into this text box. Once done, click "Submit".

{{% figure class="img-responsive" src="/img/17_submit_public_key.png#center" %}}

### Conclusion

There you have it. It's really a simple process, but one that I've had to research every time my key comes close to expiring. Hopefully it can save you a half hour of research as well. 

Additionally, instead of having to generate a new key, you've updated your existing one. This means that if someone uses your old public key, you should still be able to decrypt a message. Additionally, if you used [KeyBase](https://keybase.io), you don't have to redo all your verifications. It can be quite tedious, and also draws suspicions since it alerts all your friends that you revoked your old key.