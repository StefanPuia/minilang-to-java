package com.test;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.DelegatorFactory;

public class Test {
  public void conversionTest() {
    final Delegator hr_incidents_delegator = DelegatorFactory.getDelegator("hr-incidents");
    hr_incidents_delegator.clearCacheLine("Party");
  }

}

