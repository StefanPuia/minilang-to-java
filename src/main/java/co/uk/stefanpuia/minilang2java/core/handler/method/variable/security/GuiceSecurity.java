package co.uk.stefanpuia.minilang2java.core.handler.method.variable.security;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public class GuiceSecurity extends Security implements MethodParameter {

  public GuiceSecurity(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
