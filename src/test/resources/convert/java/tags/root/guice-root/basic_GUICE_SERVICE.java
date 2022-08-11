package com.test;

import Override;
import java.util.Map;
import org.ofbiz.entity.GenericValue;

import static org.ofbiz.service.ServiceUtil.returnSuccess;

public class Test extends AbstractGuiceService {

  private final Delegator delegator;

  @Inject
  public Test(final Delegator delegator) {
    this.delegator = delegator;
  }

  @Override
  public Map<String, Object> execute() {
    final Map<String, Object> _returnMap = returnSuccess();
    final GenericValue person = delegator.makeValidValue("Person");
    return _returnMap;
  }
}

