package co.uk.stefanpuia.minilang2java.tag.ifop;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.stream.Stream;

@MinilangTag("if")
public class If extends ConditionalTag implements IfOp {

  public If(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableChildTagNameRule.builder()
                .addRequiredAll("condition", "then")
                .addOptional("else-if", "else")
                .build());
  }

  @Override
  protected List<String> getThenLines() {
    return getThenChild().map(Tag::convert).orElse(List.of()).stream()
        .map(this::prependIndentation)
        .toList();
  }

  @Override
  public String convertCondition() {
    return getConditionChild()
        .map(Condition::convert)
        .map(List::stream)
        .flatMap(Stream::findFirst)
        .orElseThrow(() -> new TagInstantiationException("[condition] child tag missing"));
  }
}
