package co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class ServiceParameters extends Parameters implements MethodParameter {

  public ServiceParameters(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}