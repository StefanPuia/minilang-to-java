package co.uk.stefanpuia.minilang2java.core.handler.method.variable.timezone;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public abstract class TimeZone extends MethodContextVariable {

  public static final String VAR_TIME_ZONE = "timeZone";

  public TimeZone(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_TIME_ZONE;
  }

  @Override
  public VariableType getType() {
    return VariableType.from("TimeZone");
  }
}
