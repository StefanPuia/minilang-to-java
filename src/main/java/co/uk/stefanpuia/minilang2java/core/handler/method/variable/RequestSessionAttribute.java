package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest.VAR_REQUEST;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.UserLogin.TYPE_USER_LOGIN;

import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public interface RequestSessionAttribute {

  String VAR_SESSION_USER_LOGIN = "userLogin";

  private String getSessionAttribute(final VariableType type, final String key) {
    return String.format("(%s) %s.getSession().getAttribute(\"%s\")", type, VAR_REQUEST, key);
  }

  default String getUserLoginSession() {
    return getSessionAttribute(TYPE_USER_LOGIN, VAR_SESSION_USER_LOGIN);
  }
}
