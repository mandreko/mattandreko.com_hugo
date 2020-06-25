
    function writeCSS(url) {
        var stylesheet = document.createElement('link');
        stylesheet.href = url;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
    
    writeCSS('//fonts.googleapis.com/css?family=Raleway:400,700%7COpen+Sans:400,700,400italic');
    writeCSS('//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/fontawesome.min.css');
    writeCSS('/css/main.css');

    //if (! $.fn.jquery) {
    if(typeof jQuery!=='undefined'){
        document.write('<script src="/js/jquery.min.js"><\/script>');
    }
    //if (! FontAwesome) {
    if(typeof FontAwesome!=='undefined'){
        document.write('<script src="/js/fontawesome.min.js"><\/script>');
        document.write('<script src="/js/brands.min.js"><\/script>');
        document.write('<script src="/js/solid.min.js"><\/script>');
        document.write('<link rel="stylesheet" href="/css/fontawesome.min.css">');
    }
