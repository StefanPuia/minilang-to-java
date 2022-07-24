package com.test;

import java.util.Map;
import java.util.Map.Entry;

public class Test {
  public void conversionTest() {
    final Map<String, Object> theMap = foo;
    for (Entry<String, Object> theMapEntry : theMap.entrySet()) {
      final String theKey = theMapEntry.getKey();
      final Object theValue = theMapEntry.getValue();
      final Object field = theValue.get("value");
    }
  }
}
