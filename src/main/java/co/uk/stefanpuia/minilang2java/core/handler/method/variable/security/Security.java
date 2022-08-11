package co.uk.stefanpuia.minilang2java.core.handler.method.variable.security;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public abstract class Security extends MethodContextVariable {

  public static final String VAR_SECURITY = "security";
  public static final VariableType TYPE_SECURITY = VariableType.from("Security");

  public Security(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_SECURITY;
  }

  @Override
  public VariableType getType() {
    return TYPE_SECURITY;
  }
}
