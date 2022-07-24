package com.test;

import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericValue;

public class Test {
  public void conversionTest(final Delegator delegator) {
    final GenericValue output = delegator.makeValidValue("Party");
  }

}

