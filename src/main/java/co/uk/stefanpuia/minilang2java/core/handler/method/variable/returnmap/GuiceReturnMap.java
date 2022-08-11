package co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class GuiceReturnMap extends ReturnMap implements VariableAssignment {

  public GuiceReturnMap(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    context.addStaticImport(VariableType.from("ServiceUtil"), "returnSuccess");
    return getAssignment(getBaseType(), getName(), "returnSuccess()");
  }

  @Override
  public boolean isUsed() {
    return true;
  }
}
