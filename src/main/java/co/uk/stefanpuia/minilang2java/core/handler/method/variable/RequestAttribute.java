package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator.Delegator.TYPE_DELEGATOR;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher.Dispatcher.TYPE_DISPATCHER;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale.Locale.TYPE_LOCALE;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest.VAR_REQUEST;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.security.Security.TYPE_SECURITY;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone.TimeZone.TYPE_TIME_ZONE;

import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public interface RequestAttribute {

  String VAR_REQUEST_ATTR_DELEGATOR = "delegator";
  String VAR_REQUEST_ATTR_DISPATCHER = "dispatcher";
  String VAR_REQUEST_ATTR_LOCALE = "locale";
  String VAR_REQUEST_ATTR_TIME_ZONE = "timeZone";
  String VAR_REQUEST_SECURITY = "security";
  String VAR_REQUEST_ERROR_MESSAGE = "_ERROR_MESSAGE_";

  private String getRequestAttribute(final VariableType type, final String requestAttribute) {
    return String.format("(%s) %s.getAttribute(\"%s\")", type, VAR_REQUEST, requestAttribute);
  }

  default String getDelegatorRequest() {
    return getRequestAttribute(TYPE_DELEGATOR, VAR_REQUEST_ATTR_DELEGATOR);
  }

  default String getDispatcherRequest() {
    return getRequestAttribute(TYPE_DISPATCHER, VAR_REQUEST_ATTR_DISPATCHER);
  }

  default String getLocaleRequest() {
    return getRequestAttribute(TYPE_LOCALE, VAR_REQUEST_ATTR_LOCALE);
  }

  default String getSecurityRequest() {
    return getRequestAttribute(TYPE_SECURITY, VAR_REQUEST_SECURITY);
  }

  default String getTimeZoneRequest() {
    return getRequestAttribute(TYPE_TIME_ZONE, VAR_REQUEST_ATTR_TIME_ZONE);
  }
}
