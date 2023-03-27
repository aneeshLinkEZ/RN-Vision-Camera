import { useState } from "react";


interface useWebSocketApi {
    wsConnect: Promise<void>;
    isWsConnected: Promise<void>;
    onDisconnect: any

}

let ws;
let timeout;

const msg = {
    "ipAddress": "192.168.0.23",
    "port": 8090,
    "type": "websocket",
    "benchName": "Nd-matsserver-1",
    "nodeName": "Nd-matsserver-1",
    "subNodeName": "",
    "connectApi": "/authMgr/connect/",
    "schemaFileName": "serverStatus",
    "domainName": "",
    "device": ""
}


export default function useWebSocket(): useWebSocketApi {
    var ws = new WebSocket('ws://192.168.0.23:8090');

    const [isWsConnected, setIsWsConnected] = useState(false)

    const wsConnect = () => {
        var ws = new WebSocket('ws://192.168.0.23:8090');

        console.log("hello ws connected");

        ws.onopen = () => {
            // connection opened
            console.log('WebSocket connection established');
            setIsWsConnected(true);
            ws.send(msg);  // send a message
        };

        ws.onmessage = e => {
            // a message was received
            alert(e.data)
            console.log("a message was received", e.data);
        };

        ws.onerror = e => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = e => {
            // connection closed
            console.log(e.code, e.reason);
            timeout = setTimeout(() => {
                wsConnect()
            })
        };

    }

    const onDisconnect = () => {
        ws.onclose = e => {
            // connection closed
            console.log(e.code, e.reason);
            alert("disConnected")
            setIsWsConnected(false);

            // timeout = setTimeout(() => {
            //     wsConnect()
            // })
        };
    }

    return {
        wsConnect,
        isWsConnected,
        onDisconnect
    }
}