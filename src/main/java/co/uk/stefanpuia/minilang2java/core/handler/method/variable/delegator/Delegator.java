package co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public abstract class Delegator extends MethodContextVariable {
  public static final String VAR_DELEGATOR = "delegator";
  public static final VariableType TYPE_DELEGATOR = VariableType.from("Delegator");

  protected Delegator(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_DELEGATOR;
  }

  @Override
  public VariableType getType() {
    return TYPE_DELEGATOR;
  }
}
