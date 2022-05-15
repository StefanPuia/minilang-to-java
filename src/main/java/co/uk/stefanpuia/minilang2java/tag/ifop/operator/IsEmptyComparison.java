package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public class IsEmptyComparison implements Comparison {
  private final ConversionContext context;
  private final String field;

  public IsEmptyComparison(final ConversionContext context, final String field) {
    this.context = context;
    this.field = field;
  }

  @Override
  public String makeComparison() {
    context.addImport(VariableType.from("UtilValidate"));
    return String.format("UtilValidate.isEmpty(%s)", field);
  }
}
