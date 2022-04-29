package co.uk.stefanpuia.minilang2java.core.handler.method.variable.delegator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public abstract class Delegator extends MethodContextVariable {
  public static final String VAR_DELEGATOR = "delegator";

  protected Delegator(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_DELEGATOR;
  }

  @Override
  public VariableType getType() {
    return VariableType.from("Delegator");
  }
}
