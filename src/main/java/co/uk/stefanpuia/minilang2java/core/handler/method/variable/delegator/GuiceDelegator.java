package co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.root.GuiceRoot;

public class GuiceDelegator extends Delegator implements MethodParameter {

  public GuiceDelegator(final ConversionContext context, final GuiceRoot method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
