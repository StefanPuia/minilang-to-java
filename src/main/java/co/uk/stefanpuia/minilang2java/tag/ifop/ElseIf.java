package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.stream.Stream;

@MinilangTag("else-if")
public class ElseIf extends ConditionalTag implements ConditionalOp {

  public ElseIf(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(ImmutableChildTagNameRule.builder().addRequiredAll("condition", "then").build());
  }

  @Override
  public List<String> convert() {
    return List.of();
  }

  @Override
  protected List<String> getThenLines() {
    return getThenChild().map(Tag::convert).orElse(List.of());
  }

  @Override
  public String convertCondition() {
    return getConditionChild()
        .map(Tag::convert)
        .map(List::stream)
        .flatMap(Stream::findFirst)
        .orElseThrow(() -> new TagInstantiationException("[condition] child tag missing"));
  }

  @Override
  protected boolean hasOwnContext() {
    return true;
  }
}
