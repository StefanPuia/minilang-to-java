package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest.VAR_REQUEST;

public interface RequestSessionAttribute {

  String VAR_SESSION_USER_LOGIN = "userLogin";

  default String getSessionAttribute(final String type, final String key) {
    return String.format("(%s) %s.getSession().getAttribute(\"%s\")", type, VAR_REQUEST, key);
  }
}
