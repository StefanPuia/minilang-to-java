package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;

public abstract class BinaryComparator implements Comparison {
  private final ConversionContext context;
  private final String left;
  private final String right;

  public BinaryComparator(final ConversionContext context, final String left, final String right) {
    this.context = context;
    this.left = left;
    this.right = right;
  }

  @Override
  public String makeComparison() {
    context.addImport(VariableType.from("Objects"));
    return String.format("Objects.compare(%s, %s) %s", left, right, getComparisonResult());
  }

  protected abstract String getComparisonResult();
}
