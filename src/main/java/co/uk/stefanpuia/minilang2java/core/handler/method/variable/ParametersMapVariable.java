package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale.Locale.TYPE_LOCALE;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.Parameters.VAR_PARAMETERS;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.Parameters.VAR_PARAMETERS_LOCALE;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.Parameters.VAR_PARAMETERS_SECURITY;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.Parameters.VAR_PARAMETERS_TIME_ZONE;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.Parameters.VAR_PARAMETERS_USER_LOGIN;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.security.Security.TYPE_SECURITY;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone.TimeZone.TYPE_TIME_ZONE;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.UserLogin.TYPE_USER_LOGIN;

import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public interface ParametersMapVariable {
  private String getContextVariable(final VariableType type, final String key) {
    return String.format("(%s) %s.get(\"%s\")", type, VAR_PARAMETERS, key);
  }

  default String getContextLocale() {
    return getContextVariable(TYPE_LOCALE, VAR_PARAMETERS_LOCALE);
  }

  default String getContextSecurity() {
    return getContextVariable(TYPE_SECURITY, VAR_PARAMETERS_SECURITY);
  }

  default String getContextUserLogin() {
    return getContextVariable(TYPE_USER_LOGIN, VAR_PARAMETERS_USER_LOGIN);
  }

  default String getContextTimeZone() {
    return getContextVariable(TYPE_TIME_ZONE, VAR_PARAMETERS_TIME_ZONE);
  }
}
