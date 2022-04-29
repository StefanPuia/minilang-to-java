package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest.VAR_REQUEST;

public interface RequestAttribute {

  String VAR_REQUEST_ATTR_DELEGATOR = "delegator";
  String VAR_REQUEST_ATTR_DISPATCHER = "dispatcher";
  String VAR_REQUEST_ATTR_LOCALE = "locale";
  String VAR_REQUEST_ATTR_TIME_ZONE = "timeZone";
  String VAR_REQUEST_ERROR_MESSAGE = "_ERROR_MESSAGE_";

  default String getRequestAttribute(final String type, final String requestAttribute) {
    return String.format("(%s) %s.getAttribute(\"%s\")", type, VAR_REQUEST, requestAttribute);
  }

  default String getDelegatorRequest(final String type) {
    return getRequestAttribute(type, VAR_REQUEST_ATTR_DELEGATOR);
  }

  default String getDispatcherRequest(final String type) {
    return getRequestAttribute(type, VAR_REQUEST_ATTR_DISPATCHER);
  }

  default String getLocaleRequest(final String type) {
    return getRequestAttribute(type, VAR_REQUEST_ATTR_LOCALE);
  }
}
