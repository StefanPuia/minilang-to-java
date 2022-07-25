package co.uk.stefanpuia.minilang2java.core;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.ERROR;

import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.TagIdentifier;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.misc.UndefinedTag;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SuppressWarnings("PMD.ClassNamingConventions")
public final class TagFactory {

  private static final Map<TagIdentifier, Constructor<? extends Tag>> TAGS =
      new ConcurrentHashMap<>();

  public static void register(
      final TagIdentifier tagIdentifier, final Constructor<? extends Tag> constructor) {
    if (LOGGER.isInfoEnabled()) {
      LOGGER.info(
          "Loading {} {} for {}",
          "%soptimised".formatted(tagIdentifier.optimised() ? "" : "un-"),
          tagIdentifier.tagName(),
          tagIdentifier.methodMode());
    }
    TAGS.put(tagIdentifier, constructor);
  }

  private static UndefinedTag getUndefinedTag(final String tagName, final TagInit tagInit) {
    tagInit
        .conversionContext()
        .addMessage(
            ERROR, String.format("No parser defined for tag [%s]", tagName), tagInit.getPosition());
    return new UndefinedTag(tagInit);
  }

  public Tag createTag(final String tagName, final TagInit tagInit) {
    final MethodMode methodMode = tagInit.conversionContext().getMethodMode();
    final boolean optimised = tagInit.conversionContext().isOptimised();
    final var constructor =
        Stream.of(
                TAGS.get(new TagIdentifier(tagName, methodMode, optimised)),
                TAGS.get(new TagIdentifier(tagName, methodMode, !optimised)))
            .filter(Objects::nonNull)
            .findFirst();

    return constructor
        .map(
            c -> {
              try {
                return (Tag) c.newInstance(tagInit);
              } catch (InstantiationException
                  | IllegalAccessException
                  | InvocationTargetException e) {
                throw new TagInstantiationException(e);
              }
            })
        .orElseGet(() -> getUndefinedTag(tagName, tagInit));
  }

  public Collection<String> getHandledTags() {
    return TAGS.keySet().stream().map(TagIdentifier::tagName).collect(Collectors.toSet());
  }
}
