app.get('/api/rpm', function (req, res) {
    var params = req.query;
    var appId = params.app_id;
    var from = params.from;
    var to = params.to;
    var filters = {};
    if (from && to) {
        filters.from = from;
        filters.to = to;
    }
    helpers.newrelic.get('rpm', appId, filters, function(err, response, body) {
        var body = JSON.parse(body);
        var metrics = body.metric_data.metrics;
        var formattedMetrics = parseMetrics(metrics);
        res.end(JSON.stringify({
            data: formattedMetrics
        }));
        return;
    });
});

function parseMetrics(metrics) {
    var combinedMetrics = [];

    metrics = prettifyMetricNames(metrics);
    return metrics;
}

function prettifyMetricNames(metrics) {
    var prettyNames = {
        'Errors/all': 'error',
        'HttpDispatcher': 'server',
        'EndUser': 'browser'
    };

    for (var i in metrics) {
        metrics[i].pretty_name = prettyNames[metrics[i].name];
    }

    return metrics;
}

