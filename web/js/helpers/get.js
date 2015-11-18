function get(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
    };
}

