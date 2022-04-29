package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.Message;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.AttributeValueRule;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttributeValueValidatorTest {
  private final ConversionContext context = conversionContext();
  @Mock private Tag tag;

  @Test
  void shouldValidateWithNoRules() {
    // Given
    doReturn(new AttributeElement(Map.of())).when(tag).getElement();
    final var validator = new AttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldAddErrorWhenAttributeValueNotValid() {
    // Given
    doReturn(new AttributeElement(Map.of("foo", "bar"))).when(tag).getElement();
    doReturn(List.of(new AttributeValueRule("foo", List.of("some-1", "some-2"))))
        .when(tag)
        .getRules();
    final var validator = new AttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0))
        .extracting(Message::messageType)
        .isEqualTo(MessageType.ERROR);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .isEqualTo(
            "Value [bar] is not valid for attribute [foo] of tag [!test-attributes]. Should be one of [some-1, some-2]");
  }

  @Test
  void shouldNotAddErrorWhenAttributeValueIsValid() {
    // Given
    doReturn(new AttributeElement(Map.of("foo", "some-1"))).when(tag).getElement();
    doReturn(List.of(new AttributeValueRule("foo", List.of("some-1", "some-2"))))
        .when(tag)
        .getRules();
    final var validator = new AttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldAddErrorsWhenMultipleAttributeValuesNotValid() {
    // Given
    doReturn(new AttributeElement(Map.of("attr1", "someText", "attr2", "someOtherText")))
        .when(tag)
        .getElement();
    doReturn(
            List.of(
                new AttributeValueRule("attr1", List.of("some-1", "some-2")),
                new AttributeValueRule("attr2", List.of("other-1", "other-2"))))
        .when(tag)
        .getRules();
    final var validator = new AttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(2);
    then(context.getMessages())
        .extracting(Message::messageType)
        .containsExactly(MessageType.ERROR, MessageType.ERROR);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .isEqualTo(
            "Value [someText] is not valid for attribute [attr1] of tag [!test-attributes]. Should be one of [some-1, some-2]");
    then(context.getMessages().get(1))
        .extracting(Message::message)
        .isEqualTo(
            "Value [someOtherText] is not valid for attribute [attr2] of tag [!test-attributes]. Should be one of [other-1, other-2]");
  }
}
