package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_ERROR;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.Message;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.impl.AttributeElement;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttributeNameValidatorTest {

  private final ConversionContext context = conversionContext();
  @Mock private Tag tag;

  @Test
  void shouldErrorWhenMissingRequireAllAttributes() {
    // Given
    doReturn(new AttributeElement(Map.of())).when(tag).getElement();
    doReturn(RuleList.of(ImmutableAttributeNameRule.builder().addRequiredAll("required").build()))
        .when(tag)
        .getRules();

    // When
    new AttributeNameValidator(tag, context).execute();

    // Then
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0)).extracting(Message::messageType).isEqualTo(VALIDATION_ERROR);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .matches(str -> str.contains("is missing required attribute"), "error message")
        .matches(str -> str.contains("[required]"), "attribute");
  }

  @Test
  void shouldNotErrorWhenAllPresentRequireAllAttributes() {
    // Given
    final AttributeElement element = new AttributeElement(Map.of("required", "true"));
    doReturn(element).when(tag).getElement();
    doReturn(RuleList.of(ImmutableAttributeNameRule.builder().addRequiredAll("required").build()))
        .when(tag)
        .getRules();

    // When
    new AttributeNameValidator(tag, context).execute();

    // Then
    then(context.getMessages()).isEmpty();
  }

  @Test
  void shouldErrorWhenAllMissingRequireAnyAttributes() {
    // Given
    doReturn(new AttributeElement(Map.of())).when(tag).getElement();
    doReturn(
            RuleList.of(
                ImmutableAttributeNameRule.builder().addRequiredOneOf("one-of", "two-of").build()))
        .when(tag)
        .getRules();

    // When
    new AttributeNameValidator(tag, context).execute();

    // Then
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0)).extracting(Message::messageType).isEqualTo(VALIDATION_ERROR);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .matches(str -> str.contains("requires at least one of the"), "error message")
        .matches(str -> str.contains("[one-of, two-of]"), "list attributes");
  }

  @Test
  void shouldNotErrorWhenPresentRequireAnyAttributes() {
    // Given
    doReturn(new AttributeElement(Map.of("one-of", ""))).when(tag).getElement();
    doReturn(
            RuleList.of(
                ImmutableAttributeNameRule.builder().addRequiredOneOf("one-of", "two-of").build()))
        .when(tag)
        .getRules();

    // When
    new AttributeNameValidator(tag, context).execute();

    // Then
    then(context.getMessages()).isEmpty();
  }

  @Test
  void shouldWarnWhenExtraAttributes() {
    // Given
    doReturn(new AttributeElement(Map.of("one-of", "", "extra", ""))).when(tag).getElement();
    doReturn(
            RuleList.of(
                ImmutableAttributeNameRule.builder().addRequiredOneOf("one-of", "two-of").build()))
        .when(tag)
        .getRules();

    // When
    new AttributeNameValidator(tag, context).execute();

    // Then
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0))
        .extracting(Message::messageType)
        .isEqualTo(VALIDATION_WARNING);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .matches(str -> str.contains("Extra attribute"), "warn message")
        .matches(str -> str.contains("[extra]"), "list attributes");
  }

  @Test
  void shouldAppendMessagesForComplexRule() {
    // Given
    doReturn(
            new AttributeElement(
                Map.of("1-one-of", "", "1-required", "1-optional", "not-defined", "")))
        .when(tag)
        .getElement();
    doReturn(
            RuleList.of(
                ImmutableAttributeNameRule.builder()
                    .addRequiredOneOf("1-one-of", "1-two-of")
                    .addOptional("1-optional")
                    .addRequiredAll("1-required")
                    .build(),
                ImmutableAttributeNameRule.builder()
                    .addRequiredOneOf("2-one-of", "2-two-of")
                    .addOptional("2-optional")
                    .addRequiredAll("2-required")
                    .build()))
        .when(tag)
        .getRules();

    // When
    new AttributeNameValidator(tag, context).execute();

    // Then
    then(context.getMessages())
        .hasSize(3)
        .extracting(Message::messageType)
        .containsExactlyInAnyOrder(VALIDATION_ERROR, VALIDATION_ERROR, VALIDATION_WARNING);

    then(context.getMessages())
        .anyMatch(
            message ->
                message.message().contains("[not-defined]")
                    && message.message().contains("Extra attribute"));
    then(context.getMessages())
        .anyMatch(
            message ->
                message.message().contains("[2-required]")
                    && message.message().contains("is missing required attribute"));
    then(context.getMessages())
        .anyMatch(
            message ->
                message.message().contains("[2-one-of, 2-two-of]")
                    && message.message().contains("requires at least one of the"));
  }
}
