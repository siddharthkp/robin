/*

number of charts - 3
servers
browser
errors

get individual data for each app + each type, cache on server side.

*/

/* move to config */
var apps = config.applications;
var services = config.services;
var workers = config.workers;

var from = moment().subtract(1, 'days').format();
var to = moment().format();
var filters = '&from=' + from + '&to=' + to;

for (var a in apps) {
    getApplicationData(apps[a], filters, function(data) {
        var metrics = data.metrics;
        var appId = data.appId;
        for (var i in metrics) {
            var metric = metrics[i];
            var chartData = transformData(metric);
            renderChart(chartData);
            addLabel(metric.pretty_name, appId);
        }
    });
}

for (var s in services) {
    getApplicationData(services[s], filters, function(data) {
	var metrics = data.metrics;
	var appId = data.appId;
        for (var i in metrics) {
            var metric = metrics[i];
            var chartData = transformData(metric);
            renderChart(chartData, 'service');
            addLabel('service', appId);
        }
    });
}

for (var w in workers) {
    getServerData(workers[w], filters, function(data) {
	var metrics = data.metrics;
	var serverId = data.serverId;
        for (var i in metrics) {
            var metric = metrics[i];
            var chartData = transformData(metric);
            renderChart(chartData);
            addLabel(metric.pretty_name, serverId);
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
function getApplicationData(appId, filters, callback) {
    api('rpm', appId, filters, function(data) {
	var metrics = JSON.parse(data).data;
        var response = {
            appId: appId,
	    metrics: metrics
        };
        callback(response);
    });
}

/* Use cpu api to get timelices */
function getServerData(serverId, filters, callback) {
    api('cpu', serverId, filters, function(data) {
        var metrics = JSON.parse(data).data;
        var response = {
            serverId: serverId,
	    metrics: metrics
        };
	callback(response);
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
        var availableValues = metric.timeslices[i].values;
	if (type === 'server') value = availableValues.average_response_time;
	else if (type === 'browser') value = availableValues.average_response_time;
	else if (type === 'error') value = availableValues.errors_per_minute;
	else if (type === 'worker') value = parseInt(availableValues.average_value * 100 / 3972844749, 10);
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
    error: [],
    service: [],
    worker: []
};

/* Renders chart given the type */
function renderChart(data, overwriteType) {
    var type = overwriteType || data.type;
    chartDataStore[type].push(data.values);
    data.series = chartDataStore[type];
    var selector  = '#chart-' + type;
    new Chartist.Bar(selector, data, defaultChartOptions);
}

/* Adds label to chart */
function addLabel(type, id) {
    var selector = 'label ' + type;
    var chartLabel = document.getElementsByClassName(selector)[0];
    var element = document.createElement('span');
    element.innerHTML = id;
    chartLabel.appendChild(element);
}

