package co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public abstract class ReturnMap extends MethodContextVariable {

  public static final String VAR_RETURN_MAP = "_returnMap";

  public ReturnMap(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_RETURN_MAP;
  }

  @Override
  public VariableType getType() {
    return VariableType.DEFAULT_MAP_TYPE;
  }
}
