/*

number of charts - 3
servers
browser
errors

get individual data for each app + each type, cache on server side.

*/

/* move to config */
var apps = config.application_ids;

for (var i in apps) {
    /* get app name */

    /* get all metrics and push to parser */
    var from = moment().subtract(1, 'days').format();
    var to = moment().format();
    var filters = '&from=' + from + '&to=' + to;
    getData(apps[i], filters, function(metrics) {
        for (var i in metrics) {
            var metric = metrics[i];
            var chartData = transformData(metric);
            renderChart(chartData);
        }
    });
}

/* Use summary api to get app name */
function getAppName(appId, callback) {
    api('summary', appId, null, function(data) {
        callback(JSON.parse(data).data.name);
    });
}

/* Use rpm api to get timeslices */
function getData(appId, filters, callback) {
    api('rpm', appId, filters, function(data) {
        callback(JSON.parse(data).data);
    });
}

/* Transform data for chart */
function transformData(metric) {
    var type = metric.pretty_name;
    var labels = [];
    var value;
    var values = [];
    for (var i in metric.timeslices) {
        if (!(parseInt(i, 10) % 5)) {
            var timestamp = moment(metric.timeslices[i].from).format('h:mm a');
            labels.push(timestamp);
        } else labels.push('');
        value = metric.timeslices[i].values.average_response_time || metric.timeslices[i].values.errors_per_minute;
        values.push(value);
    }
    return {
        type: type,
        labels: labels,
        values: values
    }
}

/* Default chart options */
var defaultChartOptions = {
    plugins: [
        Chartist.plugins.tooltip({
            appendToBody: true
        })
    ]
};

var chartDataStore = {
    server: [],
    browser: [],
    error: []
};

/* Renders chart given the type */
function renderChart(data) {
    var type = data.type;
    chartDataStore[type].push(data.values);
    data.series = chartDataStore[type];
    var selector  = '#chart-' + type;
    new Chartist.Bar(selector, data, defaultChartOptions);
}

