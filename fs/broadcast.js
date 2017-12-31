load('api_net.js');
load('api_timer.js');
load('api_rpc.js');

function() {
    let connection = Net.connect({
        addr: 'udp://255.255.255.255:9601'
    });

    Timer.set(120000, true, function(connection) {
        let obj = {
            source: 'esp8266-thermostat'
        };

        RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function (resp, code, msg, ud) {
            ud.obj.ip = resp.wifi.sta_ip;

            Net.send(ud.connection, JSON.stringify(ud.obj));
        }, {connection: connection, obj: obj});
    }, connection);
}
