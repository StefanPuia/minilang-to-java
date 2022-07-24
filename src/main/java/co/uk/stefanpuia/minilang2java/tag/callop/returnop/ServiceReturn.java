package co.uk.stefanpuia.minilang2java.tag.callop.returnop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import java.util.List;

@MinilangTag(value = "return", mode = MethodMode.SERVICE)
public class ServiceReturn extends Return {

  public ServiceReturn(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return List.of(String.format("return %s;", getReturnMethod()));
  }

  @SuppressWarnings("PMD.OnlyOneReturn")
  private String getReturnMethod() {
    if (SUCCESS_CODE.equals(getResponseCode())) {
      context.addStaticImport(VariableType.from("ServiceUtil"), "returnSuccess");
      return "returnSuccess()";
    }
    context.addStaticImport(VariableType.from("ServiceUtil"), "returnError");
    return String.format("returnError(\"%s\")", getResponseCode());
  }
}
