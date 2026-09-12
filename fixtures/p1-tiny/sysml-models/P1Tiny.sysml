package P1Tiny {
    // Tiny fixture for bind / STALE / reproject / propose. Not Foam.
    part def PowerPort;
    part def DataPort;

    part def NestedDetector {
        port senseIn : DataPort;
        attribute partNumber = "ND-001";
    }

    part def SensorHub {
        attribute partNumber = "SH-001";
        port powerIn : PowerPort;
        port dataOut : DataPort;
        // Nested part usage: ingest MUST emit this node without hand CREATE.
        part nestedDetector : NestedDetector;
    }

    part def PowerSupply {
        attribute partNumber = "PS-001";
        port powerOut : PowerPort;
    }

    part sensorHub : SensorHub;
    part powerSupply : PowerSupply;

    connection powerFeed
        connect powerSupply.powerOut to sensorHub.powerIn;
}
