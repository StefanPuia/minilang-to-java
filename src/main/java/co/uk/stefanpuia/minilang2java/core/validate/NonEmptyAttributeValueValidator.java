package co.uk.stefanpuia.minilang2java.core.validate;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyAttributeName;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyIfPresentAttributeValueRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.w3c.dom.Node;

@TagValidator
public class NonEmptyAttributeValueValidator extends Validator<NonEmptyAttributeName> {
  private final Map<String, String> attributes;

  protected NonEmptyAttributeValueValidator(final Tag tag, final ConversionContext context) {
    super(tag, context, NonEmptyAttributeName.class);
    this.attributes = getElementAttributes();
  }

  private Map<String, String> getElementAttributes() {
    final var attributes = tag.getElement().getAttributes();
    return IntStream.range(0, attributes.getLength())
        .mapToObj(attributes::item)
        .collect(Collectors.toMap(Node::getNodeName, Node::getNodeValue));
  }

  @Override
  protected void execute() {
    getRules().stream()
        .filter(this::shouldValidateField)
        .forEach(
            rule -> {
              final var value = OptionalString.of(attributes.get(rule.name()));
              if (value.isEmpty()) {
                addMessage(
                    rule.messageType(),
                    String.format(
                        "Tag [%s] is missing a value for attribute [%s]",
                        tag.getTagName(), rule.name()));
              }
            });
  }

  private boolean shouldValidateField(final NonEmptyAttributeName rule) {
    return !(rule instanceof NonEmptyIfPresentAttributeValueRule)
        || attributes.containsKey(rule.name());
  }
}
