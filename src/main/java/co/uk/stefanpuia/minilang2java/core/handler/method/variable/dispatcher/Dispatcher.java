package co.uk.stefanpuia.minilang2java.core.handler.method.variable.dispatcher;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public abstract class Dispatcher extends MethodContextVariable {
  public static final String VAR_DISPATCHER = "dispatcher";

  public Dispatcher(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_DISPATCHER;
  }

  @Override
  public VariableType getType() {
    return VariableType.from("LocalDispatcher");
  }
}
