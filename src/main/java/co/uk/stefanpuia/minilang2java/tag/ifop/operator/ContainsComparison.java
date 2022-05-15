package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

public class ContainsComparison implements Comparison {

  private final String left;
  private final String right;

  public ContainsComparison(final String left, final String right) {
    this.left = left;
    this.right = right;
  }

  @Override
  public String makeComparison() {
    return String.format("%s.contains(%s)", left, right);
  }
}
