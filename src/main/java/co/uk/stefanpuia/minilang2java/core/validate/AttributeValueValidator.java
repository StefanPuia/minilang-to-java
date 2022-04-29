package co.uk.stefanpuia.minilang2java.core.validate;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeValueRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.w3c.dom.Node;

@TagValidator
public class AttributeValueValidator extends Validator<AttributeValueRule> {
  private final Map<String, String> attributes;

  protected AttributeValueValidator(final Tag tag, final ConversionContext context) {
    super(tag, context, AttributeValueRule.class);
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
    getRules()
        .forEach(
            rule -> {
              if (attributes.containsKey(rule.name())) {
                final var value = attributes.get(rule.name());
                if (!rule.values().contains(value)) {
                  addError(
                      format(
                          "Value [%s] is not valid for attribute [%s] of tag [%s]. Should be one of"
                              + " [%s]",
                          value,
                          rule.name(),
                          tag.getElement().getTagName(),
                          String.join(", ", rule.values())));
                }
              }
            });
  }
}
