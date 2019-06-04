var exports = module.exports = {};

//Sample ping method
exports.ping = function() {
    return "Hello from DNAC SDK";
};

//Package version
var VERSION = require('./package.json').version;
var URL_LOGIN = '/api/system/v1/auth/token';
var URL_SITES = '/api/v1/group';
var URL_NETWORK_DEVICES = '/api/v1/network-device';
var URL_NETWORK_DEVICES_COUNT = '/api/v1/network-device/count';
var URL_NETWORK_SUMMARY = '/api/assurance/v1/network-device/healthSummary?measureBy=global&windowInMin=5&startTime=1526594700000&endTime=1526681100000&limit=300&offset=1';
var URL_SITES_COUNT = '/api/v1/group/count?groupType=SITE';

var request = require('request');

function DNAC(options) {

    if (!(this instanceof DNAC)) { 
        return new DNAC(options); 
    }

    this.VERSION = VERSION;

    // Merge the default options with the client submitted options
    this.options = Object.assign({
        host: null,
        username: null,
        password: null
    }, options);
    
    this.login();
}


DNAC.prototype.login = function(callback) {
    var that = this;
    var auth = 'Basic ' + Buffer.from(this.options.username + ':' + this.options.password).toString('base64');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    
    var options = {
        url: this.options.host+URL_LOGIN,
        method: 'POST',
        headers : {
            "Authorization" : auth
        }
    };

    request(options, function(error, response, body) {
//        console.log(body);
        var bodyJSON = JSON.parse(body);
        that.AUTH_TOKEN = bodyJSON["Token"];
        if(callback) {
            return callback({
                'token': that.AUTH_TOKEN
            });
        }
    });
    
};

DNAC.prototype._getRequest = function(url, params, callback) {
    var that = this;
    if(this.AUTH_TOKEN) {
        var options = {
            url: that.options.host+url,
            qs: params,
            headers : {
                "X-Auth-Token" : this.AUTH_TOKEN
            }
        };
        request(options, function(error, response, body) {
            var bodyJSON = JSON.parse(body);
            if(callback) {
                callback(bodyJSON);
            }
        });    
    } else {
        that.login(function() {
            var options = {
                url: that.options.host+url,
                qs: params,
                headers : {
                    "X-Auth-Token" : that.AUTH_TOKEN
                }
            };
            request(options, function(error, response, body) {
                var bodyJSON = JSON.parse(body);
                if(callback) {
                    callback(bodyJSON.response);
                }
            });   
        });
    }
};

DNAC.prototype._postRequest = function(url, params, callback) {
    var that = this;
    if(this.AUTH_TOKEN) {
        var options = {
            url: that.options.host+url,
            qs: params,
            method: 'POST',
            headers : {
                "X-Auth-Token" : this.AUTH_TOKEN
            }
        };
        request(options, function(error, response, body) {
            var bodyJSON = JSON.parse(body);
            if(callback) {
                callback(bodyJSON);
            }
        });    
    } else {
        that.login(function() {
            var options = {
                url: that.options.host+url,
                qs: params,
                method: 'POST',
                headers : {
                    "X-Auth-Token" : that.AUTH_TOKEN
                }
            };
            request(options, function(error, response, body) {
                var bodyJSON = JSON.parse(body);
                if(callback) {
                    callback(bodyJSON);
                }
            });   
        });
    }

    
};

//offset=1&size=1000&field=name%2Cid%2CparentId%2CadditionalInfo.attributes.latitude%2CadditionalInfo.attributes.longitude%2CadditionalInfo.attributes.type

DNAC.prototype.getSites = function(callback) {
    var that = this;
    var params = {
            "groupType": "SITE",
            "offset": 1,
            "size": 1000,
            "field": "id,additionalInfo.attributes.type"
//            "field": "name,id,parentId,additionalInfo.attributes.latitude,additionalInfo.attributes.longitude,additionalInfo.attributes.type"
    };
    return that._getRequest(URL_SITES, params, callback);
};

DNAC.prototype.getSitesCount = function(callback) {
    var that = this;
    var params = {};
    return that._getRequest(URL_SITES_COUNT, params, callback);
};

DNAC.prototype.getNetworkDevices = function(callback) {
    var that = this;
    var params = {};
    return that._getRequest(URL_NETWORK_DEVICES, params, callback);
};

DNAC.prototype.getNetworkDevicesCount = function(callback) {
    var that = this;
    var params = {};
    return that._getRequest(URL_NETWORK_DEVICES_COUNT, params, callback);
};

DNAC.prototype.getNetworkSummary = function(callback) {
    var that = this;
    var params = {};
    return that._postRequest(URL_NETWORK_SUMMARY, params, callback);
};

module.exports = DNAC;