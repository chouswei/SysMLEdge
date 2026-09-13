package CensusOmitted {
  requirement def NeedDetect {
    doc /* Foam-complete mapping still omits requirements as graph kinds. */
  }
  item def FoamBlob;
  action def DetectFoam;
  connection def EthernetHostToSwitchPort {
    end port host;
    end port switchPort;
  }
  part def Hub {
    port out1;
  }
}
