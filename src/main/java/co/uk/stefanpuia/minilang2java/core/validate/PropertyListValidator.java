package co.uk.stefanpuia.minilang2java.core.validate;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.validate.rule.PropertiesListRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class PropertyListValidator<T extends PropertiesListRule> extends Validator<T> {

  protected PropertyListValidator(
      final Tag tag, final ConversionContext context, final Class<T> ruleClass) {
    super(tag, context, ruleClass);
  }

  protected final List<List<String>> getAnyRequired() {
    return getRules().stream().map(T::getRequiredOneOf).flatMap(List::stream).toList();
  }

  protected final Set<String> getNamesSet(final Function<T, Collection<String>> mapper) {
    return getRules().stream().map(mapper).flatMap(Collection::stream).collect(Collectors.toSet());
  }

  @Override
  protected void execute() {
    validateRequiredAll();
    validateRequiredAny();
    validateExtra();
    validateDeprecated();
    validateUnhandled();
  }

  protected abstract void validateDeprecated();

  protected abstract void validateExtra();

  protected abstract void validateRequiredAll();

  protected abstract void validateRequiredAny();

  protected abstract void validateUnhandled();
}
