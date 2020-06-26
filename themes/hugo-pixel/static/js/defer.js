
    function writeCSS(url, hash) {
        var stylesheet = document.createElement('link');
        stylesheet.href = url;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        stylesheet.integrity = hash;
        stylesheet.crossOrigin = 'anonymous';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
    
    writeCSS('https://fonts.googleapis.com/css?family=Raleway:400,700%7COpen+Sans:400,700,400italic', 'sha384-jrwaHeZLXvzrq/wEIPsqF8ZfcTPsFqq2PQUJi+grRCsP3s3YDxw1dtGT9IJ77W5s');
    writeCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/fontawesome.min.css', 'sha384-vd1e11sR28tEK9YANUtpIOdjGW14pS87bUBuOIoBILVWLFnS+MCX9T6MMf0VdPGq');
    writeCSS('https:/css/main.css', 'sha384-crvM4YqCVxvzbSflC6A1Ef2DcdxTeCs/9zVxSoJqfpldFQoEmBP90fF3VWbBDOTz');

    //if (! $.fn.jquery) {
    if(typeof jQuery!=='undefined'){
        document.write('<script src="/js/jquery.min.js" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"><\/script>');
    }
    //if (! FontAwesome) {
    if(typeof FontAwesome!=='undefined'){
        document.write('<script src="/js/fontawesome.min.js" integrity="sha384-EMmnH+Njn8umuoSMZ3Ae3bC9hDknHKOWL2e9WJD/cN6XLeAN7tr5ZQ0Hx5HDHtkS" crossorigin="anonymous"><\/script>');
        document.write('<script src="/js/brands.min.js" integrity="sha384-rUOIFHM3HXni/WG5pzDhA1e2Js5nn4bWudTYujHbbI9ztBIxK54CL4ZNZWwcBQeD" crossorigin="anonymous"><\/script>');
        document.write('<script src="/js/solid.min.js" integrity="sha384-IA6YnujJIO+z1m4NKyAGvZ9Wmxrd4Px8WFqhFcgRmwLaJaiwijYgApVpo1MV8p77" crossorigin="anonymous"><\/script>');
        document.write('<link rel="stylesheet" href="/css/fontawesome.min.css" integrity="sha384-vd1e11sR28tEK9YANUtpIOdjGW14pS87bUBuOIoBILVWLFnS+MCX9T6MMf0VdPGq" crossorigin="anonymous">');
    }
