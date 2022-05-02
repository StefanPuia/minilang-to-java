package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_DEPRECATE;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ChildTagNameRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@TagValidator
public class ChildTagNameValidator extends PropertyListValidator<ChildTagNameRule> {
  private final List<Tag> children;
  private final Set<String> childrenTagNames;

  protected ChildTagNameValidator(final Tag tag, final ConversionContext context) {
    super(tag, context, ChildTagNameRule.class);
    this.children = tag.getChildren();
    this.childrenTagNames = children.stream().map(Tag::getTagName).collect(Collectors.toSet());
  }

  @Override
  protected void validateUnhandled() {
    final var unhandledSet = getNamesSet(ChildTagNameRule::getUnhandled);
    children.stream()
        .filter(child -> unhandledSet.contains(child.getTagName()))
        .forEach(
            unhandled ->
                addMessage(
                    VALIDATION_WARNING,
                    format(
                        "Child element [%s] is unhandled for tag [%s]",
                        unhandled.getTagName(), tag.getTagName()),
                    unhandled.getPosition()));
  }

  @Override
  protected void validateDeprecated() {
    final var deprecatedSet = getNamesSet(ChildTagNameRule::getDeprecated);
    children.stream()
        .filter(child -> deprecatedSet.contains(child.getTagName()))
        .forEach(
            deprecated ->
                addMessage(
                    VALIDATION_DEPRECATE,
                    format(
                        "Child element [%s] is deprecated for tag [%s]",
                        deprecated.getTagName(), tag.getTagName()),
                    deprecated.getPosition()));
  }

  @Override
  protected void validateRequiredAny() {
    getAnyRequired().stream()
        .filter(requireOneOf -> requireOneOf.stream().noneMatch(childrenTagNames::contains))
        .forEach(
            requireOneOf ->
                addError(
                    format(
                        "Tag [%s] requires at least one of the [%s] children tags",
                        tag.getTagName(), String.join(", ", requireOneOf))));
  }

  @Override
  protected void validateExtra() {}

  @Override
  protected void validateRequiredAll() {
    getNamesSet(ChildTagNameRule::getRequiredAll).stream()
        .filter(Predicate.not(childrenTagNames::contains))
        .forEach(
            requiredTag ->
                addError(
                    format(
                        "Tag [%s] is missing required child element [%s]",
                        tag.getTagName(), requiredTag)));
  }

  @Override
  protected void execute() {
    super.execute();
    validateNoChildElements();
  }

  private void validateNoChildElements() {
    if (getRules().stream().anyMatch(ChildTagNameRule::isRequireNoChildrenElements)
        && !children.isEmpty()) {
      addWarning(format("Tag [%s] should not have any children", tag.getTagName()));
    }
  }
}
