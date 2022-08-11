package co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public class GuiceTimeZone extends TimeZone implements MethodParameter {

  public GuiceTimeZone(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
