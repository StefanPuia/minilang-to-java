package co.uk.stefanpuia.minilang2java.tag.ifop.operator;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import javax.annotation.Nullable;
import lombok.experimental.UtilityClass;

@UtilityClass
public class OperatorFactory {
  public static String compare(
      final ConversionContext context,
      final Operator operator,
      final String left,
      @Nullable final String right) {
    return newInstance(context, operator, left, right).makeComparison();
  }

  @SuppressWarnings("PMD.CyclomaticComplexity")
  private static Comparison newInstance(
      final ConversionContext context,
      final Operator operator,
      final String left,
      @Nullable final String right) {
    return switch (operator) {
      case EQUALS -> new EqualsComparison(context, left, right);
      case NOT_EQUALS -> new NotEqualsComparison(context, left, right);
      case LESS -> new LessThanComparison(context, left, right);
      case LESS_EQUALS -> new LessThanEqualsComparison(context, left, right);
      case GREATER -> new GreaterThanComparison(context, left, right);
      case GREATER_EQUALS -> new GreaterThanEqualsComparison(context, left, right);
      case CONTAINS -> new ContainsComparison(left, right);
      case IS_NULL -> new IsNullComparison(context, left);
      case IS_NOT_NULL -> new IsNotNullComparison(context, left);
      case IS_EMPTY -> new IsEmptyComparison(context, left);
    };
  }
}
