package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;

public class NotEqualsComparison extends BinaryComparator {

  public NotEqualsComparison(
      final ConversionContext context, final String left, final String right) {
    super(context, left, right);
  }

  @Override
  protected String getComparisonResult() {
    return "!= 0";
  }
}
