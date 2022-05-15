package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public class IsNullComparison implements Comparison {
  private final ConversionContext context;
  private final String field;

  public IsNullComparison(final ConversionContext context, final String field) {
    this.context = context;
    this.field = field;
  }

  @Override
  public String makeComparison() {
    context.addImport(VariableType.from("Objects"));
    return String.format("Objects.isNull(%s)", field);
  }
}
