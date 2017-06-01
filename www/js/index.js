/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// yay JS context!
var self = null;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.client = new Keen({
            projectId: "591fa0d495cfc9addc247f3a",
            readKey: "7ad97f6b7796b52e0fd4dc66432fd9bba544727c18c66a326ad6c5e2fd1a4b4857d6c9a26bc450c29c81edc550cdb79fc4ebf292e572d8f2fd8ec17f5e37297062ce62a5be90a354841cd29861994a810e91474943f6f98f97cf9017fd4d3a30"
            //writeKey: "32ae2153b992a29c10938b3e0e6880d2d90d7fe360003dc80e9237fe151f2f1acf80e832fed3b5142fbac683ff9a86a1cecca52e51a602d1b052593b5aea9098412d2c711e0ce785a6f3aa36e8ed71b059355259eacac93d30767de307ec3db4"
        });
        self = this;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.getElementById("button").addEventListener('click', this.onButtonClick, false);
        document.getElementById("view-stats").addEventListener('click', this.onStatsLinkClick, false);
        document.getElementById("view-button").addEventListener('click', this.onButtonLinkClick, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('temperature');
    },
    onStatsLinkClick: function() {
        document.getElementById("button-page").setAttribute('style', 'display:none');
        document.getElementById("stats-page").setAttribute('style', 'display:block');

        var count = new Keen.Query("count", {
            eventCollection: "temperature",
            interval: "hourly",
            targetProperty: "temperature",
            timeframe: {
                start: "2017-05-25T00:00:00.000Z",
                end: "2017-06-01T00:00:00.000Z"
            }
        });

        var countChart = new Keen.Dataviz()
            .el(document.getElementById("chart2"))
            .chartType("linechart")
            .height(200)
            .width(250)
            .prepare();

        self.client.run(count, function(err, res) {
            if (err) {
                countChart.error(err.message);
            }
            else {
                countChart
                    .parseRequest(this)
                    .title("Clicks per Hour")
                    .render();
            }
        });

        var allTimeCount = new Keen.Query("count", {
            eventCollection: "temperature",
            interval: "hourly",
            targetProperty: "temperature",
            timeframe: {
                start: "2017-05-25T00:00:00.000Z",
                end: "2017-05-31T00:00:00.000Z"
            }
        });

        var allTimeCountChart = new Keen.Dataviz()
            .el(document.getElementById("chart1"))
            .chartType("metric")
            .height(150)
            .width(250)
            .prepare();

        self.client.run(allTimeCount, function(err, res) {
            if (err) {
                allTimeCountChart.error(err.message);
            }
            else {
                allTimeCountChart
                    .parseRequest(this)
                    .title("Total Clicks")
                    .render();
            }
        });

        return false;
    },
    onButtonLinkClick: function() {
        document.getElementById("stats-page").setAttribute('style', 'display:none');
        document.getElementById("button-page").setAttribute('style', 'display:block');

        return false;
    },
    onButtonClick: function() {
        document.getElementById("button").setAttribute('style', 'display:none');
        document.getElementById("pushed-text").setAttribute('style', 'display:block');

        var eventData = {
            color: "red",
            device: device
        };
        self.client.addEvent("button clicks", eventData, function(err, res) {
            if (err) {
                console.log("Error: " + err);
            }
            else {
                console.log("Event sent.");
            }

            document.getElementById("button").setAttribute('style', 'display:block');
            document.getElementById("pushed-text").setAttribute('style', 'display:none');
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');


        console.log('Received Event: ' + id);
    }
};
