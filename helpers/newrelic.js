module.exports.get = function(key, appId, filters, callback) {
    var url = helpers.newrelic.url(key, appId);
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

module.exports.url = function(key, appId) {
    var urls = {
        'rpm': 'https://api.newrelic.com/v2/applications/' + appId + '/metrics/data.json?names[]=HttpDispatcher&names[]=EndUser&names[]=Errors/all',
        'summary': 'https://api.newrelic.com/v2/applications/' + appId + '.json'
    };
    return urls[key];
}

function jsonToQueryString(json) {
    return '?' + Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
}

