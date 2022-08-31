package co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public class GuiceDispatcher extends Dispatcher implements MethodParameter {

  public GuiceDispatcher(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}