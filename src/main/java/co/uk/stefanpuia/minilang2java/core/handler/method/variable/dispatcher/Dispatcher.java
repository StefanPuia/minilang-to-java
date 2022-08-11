package co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public abstract class Dispatcher extends MethodContextVariable {
  public static final String VAR_DISPATCHER = "dispatcher";
  public static final VariableType TYPE_DISPATCHER = VariableType.from("LocalDispatcher");

  public Dispatcher(final ConversionContext context, final Tag method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_DISPATCHER;
  }

  @Override
  public VariableType getType() {
    return TYPE_DISPATCHER;
  }
}
