package co.uk.stefanpuia.minilang2java.tag.envop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableParentTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

@MinilangTag("break")
public class Break extends Tag {

  public Break(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableParentTagNameRule.builder()
                .addRequiredOneOf(List.of("loop", "while"))
                .build());
  }

  @Override
  public List<String> convertSelf() {
    return List.of("break;");
  }
}
