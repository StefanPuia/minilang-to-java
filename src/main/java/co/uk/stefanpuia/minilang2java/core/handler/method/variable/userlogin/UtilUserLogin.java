package co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class UtilUserLogin extends UserLogin implements MethodParameter {

  public UtilUserLogin(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
