package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_DEPRECATE;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeNameRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;
import org.w3c.dom.Node;

@TagValidator
public class AttributeNameValidator extends PropertyListValidator<AttributeNameRule> {
  private final List<String> attributes;

  protected AttributeNameValidator(final Tag tag, final ConversionContext context) {
    super(tag, context, AttributeNameRule.class);
    this.attributes = getElementAttributes();
  }

  private List<String> getElementAttributes() {
    final var attributes = tag.getElement().getAttributes();
    return IntStream.range(0, attributes.getLength())
        .mapToObj(attributes::item)
        .map(Node::getNodeName)
        .toList();
  }

  @Override
  protected void validateUnhandled() {
    getNamesSet(AttributeNameRule::getUnhandled).stream()
        .filter(attributes::contains)
        .forEach(
            unhandled ->
                addMessage(
                    VALIDATION_WARNING,
                    format(
                        "Attribute [%s] is unhandled for tag [%s]", unhandled, tag.getTagName())));
  }

  @Override
  protected void validateDeprecated() {
    getNamesSet(AttributeNameRule::getDeprecated).stream()
        .filter(attributes::contains)
        .forEach(
            deprecated ->
                addMessage(
                    VALIDATION_DEPRECATE,
                    format(
                        "Attribute [%s] is deprecated for tag [%s]",
                        deprecated, tag.getTagName())));
  }

  @Override
  protected void validateRequiredAny() {
    getAnyRequired().stream()
        .filter(requireOneOf -> requireOneOf.stream().noneMatch(attributes::contains))
        .forEach(
            requireOneOf ->
                addError(
                    format(
                        "Tag [%s] requires at least one of the [%s] attributes",
                        tag.getTagName(), String.join(", ", requireOneOf))));
  }

  @Override
  protected void validateExtra() {
    final Set<String> allDefinedAttributes = getNamesSet(AttributeNameRule::getAll);
    attributes.stream()
        .filter(attribute -> !allDefinedAttributes.contains(attribute))
        .forEach(
            extraAttribute ->
                addWarning(
                    format(
                        "Extra attribute [%s] found on tag [%s]",
                        extraAttribute, tag.getTagName())));
  }

  @Override
  protected void validateRequiredAll() {
    getNamesSet(AttributeNameRule::getRequiredAll).stream()
        .filter(requireAttribute -> !attributes.contains(requireAttribute))
        .forEach(
            requiredAttribute ->
                addError(
                    format(
                        "Tag [%s] is missing required attribute [%s]",
                        tag.getTagName(), requiredAttribute)));
  }
}
