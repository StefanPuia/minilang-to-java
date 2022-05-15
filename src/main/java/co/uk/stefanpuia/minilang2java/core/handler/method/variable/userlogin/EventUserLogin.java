package co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.RequestSessionAttribute;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class EventUserLogin extends UserLogin
    implements RequestSessionAttribute, VariableAssignment {

  public EventUserLogin(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    return getAssignment(getBaseType(), getName(), getUserLoginSession());
  }
}
