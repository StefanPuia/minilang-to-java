package co.uk.stefanpuia.minilang2java.tag.entityop;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;

@MinilangTag("clear-cache-line")
public class ClearCacheLine extends Tag {

  private final Attributes attributes;

  public ClearCacheLine(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("entity-name")
                .addOptional("map")
                .addUnhandled("delegator-name")
                .build(),
            ChildTagNameRule.noChildElements());
  }

  @Override
  public List<String> convert() {
    setVariable("delegator");
    return List.of(format("delegator.clearCacheLine(%s);", getArguments()));
  }

  private String getArguments() {
    return Stream.of(
            Optional.of(attributes.getEntityName().toString()),
            attributes.getMap().map(FlexibleAccessor::makeGetter))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.joining(", "));
  }

  @AllArgsConstructor
  private class Attributes {
    private final ClearCacheLine self;

    public FlexibleStringExpander getEntityName() {
      return getAttribute("entity-name")
          .map(entity -> new FlexibleStringExpander(self, entity))
          .orElseThrow(() -> new TagConversionException("[entity-name] is empty"));
    }

    public Optional<FlexibleAccessor> getMap() {
      return getAttribute("map").map(map -> FlexibleAccessor.from(self, map));
    }
  }
}
