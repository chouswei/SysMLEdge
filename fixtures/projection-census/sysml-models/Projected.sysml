package CensusProjected {
    part def PowerPort;
    part def Hub {
        port powerIn : PowerPort;
        attribute partNumber = "H-001";
    }
    part hub : Hub;
    connection powerFeed
        connect hub.powerIn to hub.powerIn;
}
