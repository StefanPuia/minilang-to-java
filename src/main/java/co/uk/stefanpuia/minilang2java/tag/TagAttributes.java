package co.uk.stefanpuia.minilang2java.tag;

import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.core.value.StringBoolean;
import co.uk.stefanpuia.minilang2java.tag.ifop.operator.Operator;
import java.util.Arrays;
import java.util.Optional;
import java.util.function.Supplier;

public abstract class TagAttributes {
  protected final Tag self;

  protected TagAttributes(final Tag self) {
    this.self = self;
  }

  private Supplier<TagInstantiationException> attributeIsEmptyException(final String attribute) {
    return () -> new TagInstantiationException(String.format("[%s] attribute is empty", attribute));
  }

  private Supplier<TagInstantiationException> attributesAreEmptyException(
      final String... attributes) {
    return () ->
        new TagInstantiationException(
            String.format("All of [%s] attributes is empty", String.join(", ", attributes)));
  }

  protected FlexibleAccessor flexibleAccessor(final String attribute) {
    return optionalFlexibleAccessor(attribute).orElseThrow(attributeIsEmptyException(attribute));
  }

  protected Optional<FlexibleAccessor> optionalFlexibleAccessor(final String attribute) {
    return self.getAttribute(attribute).map(attr -> FlexibleAccessor.from(self, attr));
  }

  protected Optional<FlexibleAccessor> optionalFlexibleAccessor(final String... attributes) {
    return Arrays.stream(attributes)
        .map(self::getAttribute)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .findFirst()
        .map(attr -> FlexibleAccessor.from(self, attr));
  }

  protected FlexibleAccessor flexibleAccessor(final String... attributes) {
    return optionalFlexibleAccessor(attributes)
        .orElseThrow(attributesAreEmptyException(attributes));
  }

  protected FlexibleStringExpander stringExpander(final String attribute) {
    return optionalStringExpander(attribute).orElseThrow(attributeIsEmptyException(attribute));
  }

  protected Optional<FlexibleStringExpander> optionalStringExpander(final String attribute) {
    return self.getAttribute(attribute).map(entity -> new FlexibleStringExpander(self, entity));
  }

  protected Optional<FlexibleStringExpander> optionalStringExpander(final String... attributes) {
    return Arrays.stream(attributes)
        .map(self::getAttribute)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .findFirst()
        .map(attr -> new FlexibleStringExpander(self, attr));
  }

  protected VariableType variableType(final String attribute) {
    return optionalVariableType(attribute).orElseThrow(attributeIsEmptyException(attribute));
  }

  protected Optional<VariableType> optionalVariableType(final String attribute) {
    return self.getAttribute(attribute).map(VariableType::from);
  }

  protected String string(final String attribute) {
    return self.getAttribute(attribute).orElseThrow(attributeIsEmptyException(attribute));
  }

  protected boolean bool(final String attribute) {
    return self.getAttribute(attribute).map(StringBoolean::parse).orElse(false);
  }

  protected Operator getOperator() {
    final Optional<String> operatorAttr = self.getAttribute("operator");
    return operatorAttr
        .flatMap(Operator::find)
        .orElseGet(
            () -> {
              operatorAttr.ifPresent(
                  operator ->
                      self.getContext()
                          .addMessage(
                              MessageType.WARNING,
                              String.format(
                                  "[%s] is not a valid operator. Defaulting to [equals]", operator),
                              self.getPosition()));
              return Operator.EQUALS;
            });
  }
}
