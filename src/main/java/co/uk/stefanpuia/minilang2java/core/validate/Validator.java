package co.uk.stefanpuia.minilang2java.core.validate;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_ERROR;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.MessageType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ValidationRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

public abstract class Validator<T extends ValidationRule> {
  protected final Tag tag;
  private final ConversionContext context;
  private final Class<T> ruleClass;

  protected Validator(final Tag tag, final ConversionContext context, final Class<T> ruleClass) {
    this.tag = tag;
    this.context = context;
    this.ruleClass = ruleClass;
  }

  protected final void addError(final String message) {
    addMessage(VALIDATION_ERROR, message);
  }

  protected final void addWarning(final String message) {
    addMessage(VALIDATION_WARNING, message);
  }

  protected final void addMessage(final MessageType messageType, final String message) {
    context.addMessage(messageType, message, tag.getPosition());
  }

  @SuppressWarnings("unchecked")
  protected final List<T> getRules() {
    return (List<T>)
        tag.getRules().getRules().stream()
            .filter(rule -> ruleClass.isAssignableFrom(rule.getClass()))
            .toList();
  }

  protected abstract void execute();
}
