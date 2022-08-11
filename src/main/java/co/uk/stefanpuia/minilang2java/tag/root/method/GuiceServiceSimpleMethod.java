package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.GUICE_SERVICE;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.returnmap.GuiceReturnMap;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;

@MinilangTag(value = "simple-method", mode = GUICE_SERVICE)
public class GuiceServiceSimpleMethod extends SimpleMethod {

  private GuiceReturnMap guiceReturnMap;

  public GuiceServiceSimpleMethod(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  protected List<String> getReturn() {
    return List.of("return %s;".formatted(guiceReturnMap.getName()));
  }

  @Override
  protected String getParameters() {
    return "";
  }

  @Override
  protected String getReturnType() {
    context.addImport(DEFAULT_MAP_TYPE);
    return DEFAULT_MAP_TYPE.toString();
  }

  @Override
  protected void addMethodVariablesToContext() {
    guiceReturnMap = new GuiceReturnMap(context, this);
    methodContextVariables.add(guiceReturnMap);
  }

  @Override
  protected List<String> getDefaultAssignments() {
    return List.of(guiceReturnMap.convert());
  }

  @Override
  protected List<String> getMethodHeader() {
    context.addImport(VariableType.from("Override"));
    return combine("@Override", super.getMethodHeader());
  }

  @Override
  public String getMethodName() {
    return "execute";
  }

  @Override
  protected boolean hasOwnContext() {
    return false;
  }
}
