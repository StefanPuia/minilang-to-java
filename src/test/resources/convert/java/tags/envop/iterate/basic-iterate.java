package com.test;

import java.util.List;

public class Test {
  public void conversionTest() {
    final List<Map<String, Object>> theList = someList;
    for (Map<String, Object> theField : theList) {
      final Object field = theField.get("value");
    }
  }

}

