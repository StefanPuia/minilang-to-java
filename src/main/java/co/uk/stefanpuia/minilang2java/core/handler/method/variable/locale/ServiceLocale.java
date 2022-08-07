package co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.ParametersMapVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class ServiceLocale extends Locale implements VariableAssignment, ParametersMapVariable {

  public ServiceLocale(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(getBaseType(), getName(), getContextLocale());
  }
}