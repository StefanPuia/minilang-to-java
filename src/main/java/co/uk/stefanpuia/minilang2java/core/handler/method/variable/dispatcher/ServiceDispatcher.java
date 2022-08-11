package co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.DispatchContextField;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public class ServiceDispatcher extends Dispatcher
    implements VariableAssignment, DispatchContextField {

  public ServiceDispatcher(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(getBaseType(), getName(), getDispatchContextDispatcher());
  }
}
