package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.TestObjects.conversionContext;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_DEPRECATE;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_ERROR;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.convert.context.Message;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ChildTagNameValidatorTest {
  private final ConversionContext context = conversionContext();
  @Mock private Tag tag;

  private Tag mockChild(final String childName) {
    final var child = mock(Tag.class);
    doReturn(childName).when(child).getTagName();
    return child;
  }

  @Test
  void shouldValidateWithNoRules() {
    doReturn(RuleList.of()).when(tag).getRules();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldErrorWhenRequiredChildMissing() {
    doReturn("!test-tag").when(tag).getTagName();
    doReturn(RuleList.of(ImmutableChildTagNameRule.builder().addRequiredAll("some-child").build()))
        .when(tag)
        .getRules();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0)).extracting(Message::messageType).isEqualTo(VALIDATION_ERROR);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .isEqualTo("Tag [!test-tag] is missing required child element [some-child]");
  }

  @Test
  void shouldValidateWhenRequiredChildPresent() {
    doReturn(RuleList.of(ImmutableChildTagNameRule.builder().addRequiredAll("some-child").build()))
        .when(tag)
        .getRules();
    doReturn(List.of(mockChild("some-child"))).when(tag).getChildren();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldErrorWhenRequiredAnyChildMissing() {
    doReturn("!test-tag").when(tag).getTagName();
    doReturn(
            RuleList.of(
                ImmutableChildTagNameRule.builder()
                    .addRequiredOneOf(List.of("some-child", "some-child-2"))
                    .build()))
        .when(tag)
        .getRules();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0)).extracting(Message::messageType).isEqualTo(VALIDATION_ERROR);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .isEqualTo(
            "Tag [!test-tag] requires at least one of the [some-child, some-child-2] children tags");
  }

  @Test
  void shouldValidateWhenRequiredAnyChildPresent() {
    doReturn(
            RuleList.of(
                ImmutableChildTagNameRule.builder()
                    .addRequiredOneOf(List.of("some-child", "some-child-2"))
                    .build()))
        .when(tag)
        .getRules();
    doReturn(List.of(mockChild("some-child"))).when(tag).getChildren();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldWarnDeprecatedChildrenWhenPresent() {
    doReturn("!test-tag").when(tag).getTagName();
    doReturn(RuleList.of(ImmutableChildTagNameRule.builder().addDeprecated("some-child").build()))
        .when(tag)
        .getRules();
    doReturn(List.of(mockChild("some-child"))).when(tag).getChildren();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0))
        .extracting(Message::messageType)
        .isEqualTo(VALIDATION_DEPRECATE);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .isEqualTo("Child element [some-child] is deprecated for tag [!test-tag]");
  }

  @Test
  void shouldNotWarnDeprecatedChildrenWhenMissing() {
    doReturn(RuleList.of(ImmutableChildTagNameRule.builder().addDeprecated("some-child").build()))
        .when(tag)
        .getRules();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(0);
  }

  @Test
  void shouldWarnUnhandledChildrenWhenPresent() {
    doReturn("!test-tag").when(tag).getTagName();
    doReturn(RuleList.of(ImmutableChildTagNameRule.builder().addUnhandled("some-child").build()))
        .when(tag)
        .getRules();
    doReturn(List.of(mockChild("some-child"))).when(tag).getChildren();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(1);
    then(context.getMessages().get(0))
        .extracting(Message::messageType)
        .isEqualTo(VALIDATION_WARNING);
    then(context.getMessages().get(0))
        .extracting(Message::message)
        .isEqualTo("Child element [some-child] is unhandled for tag [!test-tag]");
  }

  @Test
  void shouldNotWarnUnhandledChildrenWhenMissing() {
    doReturn(RuleList.of(ImmutableChildTagNameRule.builder().addUnhandled("some-child").build()))
        .when(tag)
        .getRules();
    final var validator = new ChildTagNameValidator(tag, context);
    validator.execute();
    then(context.getMessages()).hasSize(0);
  }
}
