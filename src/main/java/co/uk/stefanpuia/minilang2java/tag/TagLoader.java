package co.uk.stefanpuia.minilang2java.tag;

import co.uk.stefanpuia.minilang2java.core.TagFactory;
import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag.MinilangTags;
import java.lang.reflect.Constructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.core.type.filter.AnnotationTypeFilter;

@Configuration
@Slf4j
public class TagLoader {

  @Order(60)
  @EventListener(ApplicationReadyEvent.class)
  @SuppressWarnings("unchecked")
  public void loadTags() {
    LOGGER.info("Loading tags...");
    try {
      final var scanner = new ClassPathScanningCandidateComponentProvider(true);
      scanner.addIncludeFilter(new AnnotationTypeFilter(MinilangTag.class));
      scanner.addIncludeFilter(new AnnotationTypeFilter(MinilangTags.class));

      final var loader = Thread.currentThread().getContextClassLoader();
      for (final var bd : scanner.findCandidateComponents("co.uk.stefanpuia.minilang2java.tag")) {
        final Class<?> tagClass = loader.loadClass(bd.getBeanClassName());
        if (Tag.class.isAssignableFrom(tagClass)) {
          final var tagAnnotations = tagClass.getAnnotationsByType(MinilangTag.class);
          for (final MinilangTag tagAnnotation : tagAnnotations) {
            final Constructor<Tag> constructor =
                (Constructor<Tag>) tagClass.getConstructor(TagInit.class);
            if (tagAnnotation.mode() == MethodMode.ANY) {
              TagFactory.register(tagAnnotation.value(), MethodMode.EVENT, constructor);
              TagFactory.register(tagAnnotation.value(), MethodMode.SERVICE, constructor);
              TagFactory.register(tagAnnotation.value(), MethodMode.UTIL, constructor);
            } else {
              TagFactory.register(tagAnnotation.value(), tagAnnotation.mode(), constructor);
            }
          }
        }
      }
      LOGGER.info("Finished loading tags");
    } catch (ClassNotFoundException | NoSuchMethodException e) {
      LOGGER.error("Error loading tags", e);
      throw new IllegalStateException(e);
    }
  }
}
