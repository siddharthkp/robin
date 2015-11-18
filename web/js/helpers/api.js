function api(key, id, filters, callback) {
    var base = '/api/';
    var url = base + key;
    if (key === 'cpu') url += '?server_id=' + id;
    else url += '?app_id=' + id;
    if (filters) url += filters;
    get(url, callback);
}
