package co.uk.stefanpuia.minilang2java.tag.entityop;

import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.entityop.ClearCacheLine.Attributes;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@MinilangTag("clear-cache-line")
public class ClearCacheLine extends EntityOperation<Attributes> {

  private final Attributes attributes;

  public ClearCacheLine(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected Attributes getAttributes() {
    return attributes;
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("entity-name")
                .addOptional("map")
                .build(),
            ChildTagNameRule.noChildElements());
  }

  @Override
  public List<String> convertSelf() {
    return combine(
        super.convertSelf(),
        "%s.clearCacheLine(%s);".formatted(getDelegatorName(), getArguments()));
  }

  private String getArguments() {
    return Stream.of(
            Optional.of(attributes.getEntityName().toSafeString()),
            attributes.getMap().map(FlexibleAccessor::makeGetter))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.joining(", "));
  }

  protected static class Attributes extends EntityOpAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getEntityName() {
      return stringExpander("entity-name");
    }

    public Optional<FlexibleAccessor> getMap() {
      return optionalFlexibleAccessor("map");
    }
  }
}
