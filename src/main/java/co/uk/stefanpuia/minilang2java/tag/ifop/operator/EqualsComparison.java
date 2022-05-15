package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public class EqualsComparison implements Comparison {

  private final ConversionContext context;
  private final String left;
  private final String right;

  public EqualsComparison(final ConversionContext context, final String left, final String right) {
    this.context = context;
    this.left = left;
    this.right = right;
  }

  @Override
  public String makeComparison() {
    context.addImport(VariableType.from("Objects"));
    return String.format("Objects.equals(%s, %s)", left, right);
  }
}
