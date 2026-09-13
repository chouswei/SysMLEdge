package CensusBadQuote {
  part cameraBinding {
    port bindingOut;
  }
  part aravisAcquire {
    port cameraIn;
  }

  attribute lookalike : String = "80gp\";
  attribute jsonish : String = \"oneshot\";

  connection afterEscapedQuote {
    end port source ::> cameraBinding.bindingOut;
    end port sink ::> aravisAcquire.cameraIn;
  }
}
