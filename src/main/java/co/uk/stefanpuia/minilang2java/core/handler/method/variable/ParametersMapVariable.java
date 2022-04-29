package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters.Parameters.VAR_PARAMETERS;

public interface ParametersMapVariable {
  default String getContextVariable(final String type, final String key) {
    return String.format("(%s) %s.get(\"%s\")", type, VAR_PARAMETERS, key);
  }
}
