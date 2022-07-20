package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_DEPRECATE;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static java.lang.String.format;
import static java.util.function.Predicate.not;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ParentTagNameRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.function.Function;

@TagValidator
public class ParentTagNameValidator extends PropertyListValidator<ParentTagNameRule> {
  private final String parentName;

  protected ParentTagNameValidator(final Tag tag, final ConversionContext context) {
    super(tag, context, ParentTagNameRule.class);
    this.parentName = tag.getParent(Tag.class).map(Tag::getTagName).orElse("!");
  }

  private boolean checkParent(final Function<String, Boolean> predicate) {
    return predicate.apply(parentName);
  }

  @Override
  protected void validateUnhandled() {
    if (checkParent(getNamesSet(ParentTagNameRule::getUnhandled)::contains)) {
      addMessage(
          VALIDATION_WARNING,
          format("Tag [%s] is not handled as child of [%s]", tag.getTagName(), parentName),
          tag.getPosition());
    }
  }

  @Override
  protected void validateDeprecated() {
    if (checkParent(getNamesSet(ParentTagNameRule::getDeprecated)::contains)) {
      addMessage(
          VALIDATION_DEPRECATE,
          format("Tag [%s] is not deprecated as child of [%s]", tag.getTagName(), parentName),
          tag.getPosition());
    }
  }

  @Override
  protected void validateRequiredAny() {
    getAnyRequired().stream()
        .filter(not(requireOneOf -> requireOneOf.contains(parentName)))
        .forEach(
            requireOneOf ->
                addError(
                    format(
                        "Tag [%s] needs to be a child of one of the [%s] tags",
                        tag.getTagName(), String.join(", ", requireOneOf))));
  }

  @Override
  protected void validateExtra() {}

  @Override
  protected void validateRequiredAll() {}
}
