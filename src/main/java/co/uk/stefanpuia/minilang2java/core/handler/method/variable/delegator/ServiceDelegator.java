package co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.DispatchContextField;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class ServiceDelegator extends Delegator
    implements VariableAssignment, DispatchContextField {

  public ServiceDelegator(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(getBaseType(), getName(), getDispatchContextDelegator());
  }
}
