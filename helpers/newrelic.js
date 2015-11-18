module.exports.get = function(key, id, filters, callback) {
    var url = helpers.newrelic.url(key, id);
    if (filters) {
        url += '&' + jsonToQueryString(filters);
    }
    var options = {
        url: url,
        headers: {
            'X-Api-Key': config.newrelic_api_key
        }
    };
    if (typeof callback !== 'function') callback = function() {};
    request(options, callback);
}

module.exports.url = function(key, id) {
    var urls = {
        'rpm': 'https://api.newrelic.com/v2/applications/' + id + '/metrics/data.json?names[]=HttpDispatcher&names[]=EndUser&names[]=Errors/all',
        'summary': 'https://api.newrelic.com/v2/applications/' + id + '.json',
        'cpu': 'https://api.newrelic.com/v2/servers/' + id + '/metrics/data.json?names[]=System/Memory/Used/bytes'
    };
    return urls[key];
}

function jsonToQueryString(json) {
    return '?' + Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
}

