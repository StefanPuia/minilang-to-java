package co.uk.stefanpuia.minilang2java.core.validate.rule;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import java.util.List;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
@SuppressWarnings("PMD.ShortMethodName")
public abstract class RuleList {
  public static RuleList of(final ValidationRule... rules) {
    return ImmutableRuleList.builder().setRules(List.of(rules)).build();
  }

  public static RuleList empty() {
    return ImmutableRuleList.builder().build();
  }

  public abstract List<ValidationRule> getRules();

  public RuleList addRules(final ValidationRule... rules) {
    return ImmutableRuleList.builder().from(this).addRules(rules).build();
  }
}
