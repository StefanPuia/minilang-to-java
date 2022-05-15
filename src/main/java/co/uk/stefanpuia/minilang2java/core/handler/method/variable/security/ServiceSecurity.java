package co.uk.stefanpuia.minilang2java.core.handler.method.variable.security;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.ParametersMapVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class ServiceSecurity extends Security implements VariableAssignment, ParametersMapVariable {

  public ServiceSecurity(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(getBaseType(), getName(), getContextVariable(getBaseType(), "security"));
  }
}
