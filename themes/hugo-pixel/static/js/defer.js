
    function writeCSS(url, hash) {
        var stylesheet = document.createElement('link');
        stylesheet.href = url;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        stylesheet.integrity = hash;
        stylesheet.crossOrigin = 'anonymous';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
    
    writeCSS('https://fonts.googleapis.com/css?family=Raleway:400,700%7COpen+Sans:400,700,400italic', 'sha384-RSQ9NS1fkHbnW9v603KaA4y7+nE4lqvtUJvzw5FySE5uxR4mFt850VrEILW2ZsHm');
    writeCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/fontawesome.min.css', 'sha256-+NADVoWZmHhL2ibh0U8tmBUVkhuW3tUNXW9vDnW6wVw=');
    writeCSS('/css/main.css', 'sha256-XSCkg3ZwX7titBz6C+W+xWqUq5wq1NVY0k4CRSwhxcI=');

    //if (! $.fn.jquery) {
    if(typeof jQuery!=='undefined'){
        document.write('<script src="/js/jquery.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"><\/script>');
    }
    //if (! FontAwesome) {
    if(typeof FontAwesome!=='undefined'){
        document.write('<script src="/js/fontawesome.min.js" integrity="sha256-TMRxGf3NaZhrxTfD8y/NGiyE4UXBA3udH1l+Co8JDVU=" crossorigin="anonymous"><\/script>');
        document.write('<script src="/js/brands.min.js" integrity="sha256-lp5km2M1v44bqE38HojZ8uz34u+s+NPPlvmtRM9h8zA=" crossorigin="anonymous"><\/script>');
        document.write('<script src="/js/solid.min.js" integrity="sha256-AvFW059sTpul/l4lUQdCw21U5Fp9uxldIzvCQrCdf2Q=" crossorigin="anonymous"><\/script>');
        document.write('<link rel="stylesheet" href="/css/fontawesome.min.css" integrity="sha384-vd1e11sR28tEK9YANUtpIOdjGW14pS87bUBuOIoBILVWLFnS+MCX9T6MMf0VdPGq" crossorigin="anonymous">');
    }
