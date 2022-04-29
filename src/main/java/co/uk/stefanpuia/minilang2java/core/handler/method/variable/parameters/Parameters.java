package co.uk.stefanpuia.minilang2java.core.handler.method.variable.parameters;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public abstract class Parameters extends MethodContextVariable {
  public static final String VAR_PARAMETERS_LOCALE = "locale";
  public static final String VAR_PARAMETERS_TIME_ZONE = "timeZone";
  public static final String VAR_PARAMETERS_USER_LOGIN = "userLogin";

  public static final String VAR_PARAMETERS = "parameters";

  public Parameters(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_PARAMETERS;
  }

  @Override
  public VariableType getType() {
    return VariableType.DEFAULT_MAP_TYPE;
  }
}
