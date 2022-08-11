package co.uk.stefanpuia.minilang2java.core.handler.method.variable.locale;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public abstract class Locale extends MethodContextVariable {
  public static final String VAR_LOCALE = "locale";
  public static final VariableType TYPE_LOCALE = VariableType.from("Locale");

  public Locale(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_LOCALE;
  }

  @Override
  public VariableType getType() {
    return TYPE_LOCALE;
  }
}
