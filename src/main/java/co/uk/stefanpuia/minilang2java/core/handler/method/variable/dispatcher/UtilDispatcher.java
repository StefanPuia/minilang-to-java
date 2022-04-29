package co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class UtilDispatcher extends Dispatcher implements MethodParameter {

  public UtilDispatcher(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
