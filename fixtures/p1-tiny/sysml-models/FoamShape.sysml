package FoamShape {
  doc /*
    Comment must survive markdown glob star-star-slash-star and admin path bold
    without closing the block comment early.
  */
  part def SurvivesMarkdownComment {
    port bindingOut;
    port cameraIn;
  }

  part cameraBinding {
    port bindingOut;
  }
  part aravisAcquire {
    port cameraIn;
  }

  connection def EthernetHostToSwitchPort {
    end port host : EthernetPort;
    end port switchPort : EthernetPort;
  }

  connection linkBindingToAcquire {
    end port source ::> cameraBinding.bindingOut;
    end port sink ::> aravisAcquire.cameraIn;
  }

  attribute lookalike : String = "80gp\";
  attribute jsonish : String = \"oneshot\";
  attribute designMaturity : String = "under-design";

  connection afterEscapedQuote {
    end port source ::> cameraBinding.bindingOut;
    end port sink ::> aravisAcquire.cameraIn;
  }

  connection powerFeedNamed
      connect cameraBinding.bindingOut to aravisAcquire.cameraIn;
}
