function api(key, appId, filters, callback) {
    var base = 'http://localhost:8001/';
    var url = base + key + '?app_id=' + appId;
    if (filters) url += filters;
    get(url, callback);
}
