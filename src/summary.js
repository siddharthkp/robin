app.get('/api/summary', function (req, res) {
    var params = req.query;
    var appId = params.app_id;

    helpers.newrelic.get('summary', appId, null, function(err, response, body) {
        var application = JSON.parse(body).application;
        res.end(JSON.stringify({
            data: application
        }));
    });
});
