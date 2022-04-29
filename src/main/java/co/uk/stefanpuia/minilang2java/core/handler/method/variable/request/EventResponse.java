package co.uk.stefanpuia.minilang2java.core.handler.method.variable.request;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodParameter;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class EventResponse extends MethodContextVariable implements MethodParameter {

  public static final String VAR_RESPONSE = "response";

  public EventResponse(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_RESPONSE;
  }

  @Override
  protected String getConverted() {
    return getMethodParameter(getBaseType(), getName());
  }

  @Override
  public VariableType getType() {
    return VariableType.from("HttpServletResponse");
  }
}
