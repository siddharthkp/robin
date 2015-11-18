function api(key, appId, filters, callback) {
    var base = '/api/';
    var url = base + key + '?app_id=' + appId;
    if (filters) url += filters;
    get(url, callback);
}
