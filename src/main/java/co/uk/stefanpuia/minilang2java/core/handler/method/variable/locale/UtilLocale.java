package co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class UtilLocale extends Locale implements MethodParameter {

  public UtilLocale(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
