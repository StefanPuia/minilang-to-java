package co.uk.stefanpuia.minilang2java.tag.envop;

import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.indent;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.ifop.Condition;
import co.uk.stefanpuia.minilang2java.tag.ifop.Then;
import java.util.List;

@MinilangTag("while")
public class While extends Tag {

  public While(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableChildTagNameRule.builder().addRequiredAll("condition", "then").build());
  }

  @Override
  public List<String> convert() {
    return combine(
        format("while (%s) {", getFirstChild(Condition.class).convertCondition()),
        indent(this, getFirstChild(Then.class).convert()),
        "}");
  }
}
