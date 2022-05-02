package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_DEPRECATE;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeNameRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.w3c.dom.Node;

@TagValidator
public class AttributeNameValidator extends Validator<AttributeNameRule> {
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
  protected void execute() {
    validateRequiredAllAttributes();
    validateRequiredAnyAttributes();
    warnExtraAttributes();
    warnDeprecatedAttributes();
    warnUnhandledAttributes();
  }

  private void warnUnhandledAttributes() {
    getRules().stream()
        .map(AttributeNameRule::getUnhandled)
        .flatMap(List::stream)
        .collect(Collectors.toSet())
        .stream()
        .filter(attributes::contains)
        .forEach(
            unhandled ->
                addMessage(
                    VALIDATION_WARNING,
                    String.format(
                        "Attribute [%s] is unhandled for tag [%s]", unhandled, tag.getTagName())));
  }

  private void warnDeprecatedAttributes() {
    getRules().stream()
        .map(AttributeNameRule::getDeprecated)
        .flatMap(List::stream)
        .collect(Collectors.toSet())
        .stream()
        .filter(attributes::contains)
        .forEach(
            deprecated ->
                addMessage(
                    VALIDATION_DEPRECATE,
                    String.format(
                        "Attribute [%s] is deprecated for tag [%s]",
                        deprecated, tag.getTagName())));
  }

  private void validateRequiredAnyAttributes() {
    getAnyRequired().stream()
        .filter(list -> !list.isEmpty())
        .filter(requireOneOf -> requireOneOf.stream().noneMatch(attributes::contains))
        .forEach(
            requireOneOf ->
                addError(
                    format(
                        "Tag [%s] requires at least one of the [%s] attributes",
                        tag.getTagName(), String.join(", ", requireOneOf))));
  }

  private void warnExtraAttributes() {
    final Set<String> allDefinedAttributes = getAllHandled();
    attributes.stream()
        .filter(attribute -> !allDefinedAttributes.contains(attribute))
        .forEach(
            extraAttribute ->
                addWarning(
                    format(
                        "Extra attribute [%s] found on tag [%s]",
                        extraAttribute, tag.getTagName())));
  }

  private Set<String> getAllHandled() {
    return getRules().stream()
        .map(AttributeNameRule::getAllAttributes)
        .flatMap(Set::stream)
        .collect(Collectors.toSet());
  }

  private void validateRequiredAllAttributes() {
    getAllRequired().stream()
        .filter(requireAttribute -> !attributes.contains(requireAttribute))
        .forEach(
            requiredAttribute ->
                addError(
                    format(
                        "Tag [%s] is missing required attribute [%s]",
                        tag.getTagName(), requiredAttribute)));
  }

  private Set<String> getAllRequired() {
    return getRules().stream()
        .map(AttributeNameRule::getRequiredAll)
        .flatMap(List::stream)
        .collect(Collectors.toSet());
  }

  private List<List<String>> getAnyRequired() {
    return getRules().stream().map(AttributeNameRule::getRequiredOneOf).toList();
  }
}
