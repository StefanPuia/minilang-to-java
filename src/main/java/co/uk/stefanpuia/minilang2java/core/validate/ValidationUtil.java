package co.uk.stefanpuia.minilang2java.core.validate;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.ValidatorInstantiationException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

@UtilityClass
@Slf4j
public final class ValidationUtil {
  private static final List<Constructor<?>> VALIDATORS = new ArrayList<>();

  public static void validate(final Tag tag, final ConversionContext conversionContext) {
    VALIDATORS.stream()
        .map(constructor -> getNewInstance(tag, conversionContext, constructor))
        .forEach(Validator::execute);
  }

  private static Validator<?> getNewInstance(
      final Tag tag, final ConversionContext conversionContext, final Constructor<?> constructor) {
    try {
      return (Validator<?>) constructor.newInstance(tag, conversionContext);
    } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
      throw new ValidatorInstantiationException(e);
    }
  }

  public static void register(
      final Class<?> validationRuleClass, final Constructor<?> constructor) {
    LOGGER.info("Loading {}", validationRuleClass);
    VALIDATORS.add(constructor);
  }
}
