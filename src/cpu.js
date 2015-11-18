app.get('/api/cpu', function (req, res) {
    var params = req.query;
    var serverId = params.server_id;
    var from = params.from;
    var to = params.to;
    var filters = {};
    if (from && to) {
        filters.from = from;
        filters.to = to;
    }
    helpers.newrelic.get('cpu', serverId, filters, function(err, response, body) {
        var body = JSON.parse(body);
        var metrics = body.metric_data.metrics;
	metrics[0].pretty_name = 'worker';
        res.end(JSON.stringify({
            data: metrics
        }));
        return;
    });
});


