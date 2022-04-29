package co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.VariableAssignment;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public class ServiceReturnMap extends ReturnMap implements VariableAssignment {

  public ServiceReturnMap(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  protected String getConverted() {
    context.addStaticImport(VariableType.from("ServiceUtil"), "returnSuccess");
    return getAssignment(getBaseType(), getName(), "returnSuccess()");
  }
}
