package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.Message;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyAttributeValueRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyIfPresentAttributeValueRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NonEmptyAttributeValueValidatorTest {
  private final ConversionContext context = conversionContext();
  @Mock private Tag tag;

  public static Stream<Arguments> emptyValues() {
    return Stream.of(
        Arguments.of(Map.of("attr1", "")),
        Arguments.of(Map.of()),
        Arguments.of(Map.of("attr1", "  ")),
        Arguments.of(Map.of("attr1", "\n ")));
  }

  @Test
  void shouldValidateWithNoRules() {
    // Given
    doReturn(RuleList.empty()).when(tag).getRules();
    doReturn(new AttributeElement(Map.of())).when(tag).getElement();
    final var validator = new NonEmptyAttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(0);
  }

  @ParameterizedTest
  @MethodSource("emptyValues")
  void shouldAddMessageWhenAttributeValueIsNull(final Map<String, String> attributes) {
    // Given
    doReturn("!test-attributes").when(tag).getTagName();
    doReturn(new AttributeElement(attributes)).when(tag).getElement();
    doReturn(RuleList.of(new NonEmptyAttributeValueRule("attr1", VALIDATION_WARNING)))
        .when(tag)
        .getRules();
    final var validator = new NonEmptyAttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages())
        .hasSize(1)
        .extracting(Message::messageType)
        .containsExactly(VALIDATION_WARNING);
    then(context.getMessages())
        .extracting(Message::message)
        .allMatch(
            str -> str.contains("Tag [!test-attributes] is missing a value for attribute [attr1]"));
  }

  @Test
  void shouldNotAddMessageForNonEmptyValue() {
    // Given
    doReturn(new AttributeElement(Map.of("attr1", "some value"))).when(tag).getElement();
    doReturn(RuleList.of(new NonEmptyAttributeValueRule("attr1", VALIDATION_WARNING)))
        .when(tag)
        .getRules();
    final var validator = new NonEmptyAttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldNotAddMessageWithIfPresentRuleAndNullValue() {
    // Given
    doReturn(new AttributeElement(Map.of())).when(tag).getElement();
    doReturn(RuleList.of(new NonEmptyIfPresentAttributeValueRule("attr1", VALIDATION_WARNING)))
        .when(tag)
        .getRules();
    final var validator = new NonEmptyAttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldAddMessageWithIfPresentRuleAndEmptyValue() {
    // Given
    doReturn("!test-attributes").when(tag).getTagName();
    doReturn(new AttributeElement(Map.of("attr1", ""))).when(tag).getElement();
    doReturn(RuleList.of(new NonEmptyIfPresentAttributeValueRule("attr1", VALIDATION_WARNING)))
        .when(tag)
        .getRules();
    final var validator = new NonEmptyAttributeValueValidator(tag, context);

    // When
    validator.execute();

    // Then
    then(context.getMessages())
        .hasSize(1)
        .extracting(Message::messageType)
        .containsExactly(VALIDATION_WARNING);
    then(context.getMessages())
        .extracting(Message::message)
        .allMatch(
            str -> str.contains("Tag [!test-attributes] is missing a value for attribute [attr1]"));
  }
}
