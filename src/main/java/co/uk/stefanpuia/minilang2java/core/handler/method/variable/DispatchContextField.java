package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.service.DispatchContext.VAR_DISPATCH_CONTEXT;

public interface DispatchContextField {
  default String getDispatchContextDelegator() {
    return String.format("%s.getDelegator()", VAR_DISPATCH_CONTEXT);
  }

  default String getDispatchContextDispatcher() {
    return String.format("%s.getDispatcher()", VAR_DISPATCH_CONTEXT);
  }
}
