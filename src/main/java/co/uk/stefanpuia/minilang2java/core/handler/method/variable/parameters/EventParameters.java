package co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.request.EventRequest.VAR_REQUEST;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class EventParameters extends Parameters implements VariableAssignment {

  public EventParameters(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(
        getBaseType(), getName(), String.format("%s.getParametersMap()", VAR_REQUEST));
  }
}
