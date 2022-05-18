package co.uk.stefanpuia.minilang2java.tag.envop;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_ERROR;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_TYPE;
import static co.uk.stefanpuia.minilang2java.util.StreamUtil.firstPresent;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyAttributeValueRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyIfPresentAttributeValueRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@MinilangTag("set")
public class SetElement extends Tag {

  public static final String FROM = "from";
  private static final String FROM_FIELD = "from-field";
  private static final String FIELD = "field";
  private final Attributes attributes;

  public SetElement(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll(FIELD)
                .addRequiredOneOf(List.of(FROM_FIELD, FROM, "value"))
                .addDeprecated(FROM_FIELD, "default")
                .addUnhandled("format")
                .addOptional(
                    FIELD,
                    FROM_FIELD,
                    FROM,
                    "value",
                    "default-value",
                    "default",
                    "format",
                    "type",
                    "set-if-null",
                    "set-if-empty")
                .build(),
            new NonEmptyIfPresentAttributeValueRule(FROM_FIELD, VALIDATION_ERROR),
            new NonEmptyIfPresentAttributeValueRule(FROM, VALIDATION_ERROR),
            new NonEmptyAttributeValueRule(FIELD, VALIDATION_ERROR),
            ChildTagNameRule.noChildElements());
  }

  @Override
  public List<String> convert() {
    final var lines = new ArrayList<>(getConvert());
    setVariable(new ContextVariable(attributes.getField().getField(), 1, attributes.getType()));
    addDefaultLines(lines);
    return lines;
  }

  private void addDefaultLines(final List<String> lines) {
    attributes
        .getDefault()
        .map(FlexibleStringExpander::toString)
        .ifPresent(
            defaultValue -> {
              getContext().addImport(VariableType.from("UtilValidate"));
              lines.add(
                  format("if (UtilValidate.isEmpty(%s)) {", attributes.getField().makeGetter()));
              lines.addAll(
                  attributes.getField().makeSetter(defaultValue).stream()
                      .map(this::prependIndentation)
                      .toList());
              lines.add("}");
            });
  }

  private List<String> getConvert() {
    final String conditions = getConditions();
    return conditions.isBlank()
        ? attributes.getField().makeSetter(attributes.getType(), getValue())
        : getWrappedWithConditions(conditions);
  }

  private List<String> getWrappedWithConditions(final String conditions) {
    final List<String> lines =
        new ArrayList<>(attributes.getField().makeSplitSetter(attributes.getType(), getValue()));
    final String assignment = lines.get(lines.size() - 1);
    lines.remove(assignment);
    lines.add(format("if (%s) {", conditions));
    lines.add(prependIndentation(assignment));
    lines.add("}");
    return lines;
  }

  private String getConditions() {
    return Stream.of(getSetIfEmpty(), getSetIfNull())
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.joining(" || "));
  }

  private Optional<String> getSetIfEmpty() {
    if (attributes.isSetIfEmpty()) {
      getContext().addImport(VariableType.from("UtilValidate"));
    }
    return attributes.isSetIfEmpty()
        ? Optional.of(format("UtilValidate.isEmpty(%s)", attributes.getField().makeGetter()))
        : Optional.empty();
  }

  private Optional<String> getSetIfNull() {
    return attributes.isSetIfNull()
        ? Optional.of(format("%s == null", attributes.getField().makeGetter()))
        : Optional.empty();
  }

  private String getValue() {
    return attributes
        .getFrom()
        .map(FlexibleAccessor::makeGetter)
        .orElseGet(
            () -> attributes.getValue().map(FlexibleStringExpander::toString).orElse("null"));
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleAccessor getField() {
      return flexibleAccessor(FIELD);
    }

    public Optional<FlexibleAccessor> getFrom() {
      return optionalFlexibleAccessor(FROM, FROM_FIELD);
    }

    public Optional<FlexibleStringExpander> getValue() {
      return optionalStringExpander("value");
    }

    public Optional<FlexibleStringExpander> getDefault() {
      return optionalStringExpander("default", "default-value");
    }

    public boolean isSetIfNull() {
      return bool("set-if-null");
    }

    public boolean isSetIfEmpty() {
      return bool("set-if-empty");
    }

    public VariableType getType() {
      return firstPresent(
              optionalVariableType("type"),
              self.getVariable(getField().getField()).map(ContextVariable::type))
          .orElse(DEFAULT_TYPE);
    }
  }
}
