package co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public class GuiceUserLogin extends UserLogin implements MethodParameter {

  public GuiceUserLogin(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
