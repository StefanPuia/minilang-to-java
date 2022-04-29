package co.uk.stefanpuia.minilang2java.core.validate;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.exception.ValidatorInstantiationException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.core.type.filter.AnnotationTypeFilter;

@Configuration
@Slf4j
public class ValidatorLoader {

  @Order(50)
  @EventListener(ApplicationReadyEvent.class)
  public void loadValidators() {
    LOGGER.info("Loading validators...");
    try {
      final var scanner = new ClassPathScanningCandidateComponentProvider(true);
      scanner.addIncludeFilter(new AnnotationTypeFilter(TagValidator.class));

      final var loader = Thread.currentThread().getContextClassLoader();
      for (final var bd :
          scanner.findCandidateComponents("co.uk.stefanpuia.minilang2java.core.validate")) {
        final Class<?> validatorClass = loader.loadClass(bd.getBeanClassName());
        if (Validator.class.isAssignableFrom(validatorClass)) {
          ValidationUtil.register(
              validatorClass,
              validatorClass.getDeclaredConstructor(Tag.class, ConversionContext.class));
        }
      }
      LOGGER.info("Finished loading validators");
    } catch (ClassNotFoundException | NoSuchMethodException e) {
      LOGGER.error("Error loading validators", e);
      throw new ValidatorInstantiationException(e);
    }
  }
}
