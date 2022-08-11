package co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public class GuiceLocale extends Locale implements MethodParameter {

  public GuiceLocale(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }
}
