package co.uk.stefanpuia.minilang2java.core.validate;

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
                        tag.getElement().getTagName(), String.join(", ", requireOneOf))));
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
                        extraAttribute, tag.getElement().getTagName())));
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
                        tag.getElement().getTagName(), requiredAttribute)));
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
