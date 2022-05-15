package co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.RequestAttribute;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class EventTimeZone extends TimeZone implements RequestAttribute, VariableAssignment {

  public EventTimeZone(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(getBaseType(), getName(), getTimeZoneRequest());
  }
}
