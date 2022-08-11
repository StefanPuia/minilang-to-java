package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.Tag;

public abstract class MethodContextVariable {
  protected final ConversionContext context;
  protected final Tag root;

  public MethodContextVariable(final ConversionContext context, final Tag root) {
    this.context = context;
    this.root = root;
  }

  public boolean isUsed() {
    final var variable = root.getVariable(getName());
    return variable.map(ContextVariable::count).orElse(0) > 0;
  }

  public abstract String getName();

  protected abstract String getConverted();

  public abstract VariableType getType();

  public final String convertIfUsed() {
    String output = "";
    if (isUsed()) {
      context.addImport(getType());
      output = getConverted();
    }
    return output;
  }

  public final String convert() {
    context.addImport(getType());
    return getConverted();
  }

  protected final String getBaseType() {
    return getType().toString();
  }

  public final ContextVariable asUnused() {
    return new ContextVariable(getName(), 0, getType());
  }
}
