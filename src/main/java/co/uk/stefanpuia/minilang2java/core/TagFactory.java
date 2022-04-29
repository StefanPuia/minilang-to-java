package co.uk.stefanpuia.minilang2java.core;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.ERROR;

import co.uk.stefanpuia.minilang2java.core.model.MethodMode;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.ValidationUtil;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.misc.UndefinedTag;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;

@Slf4j
@UtilityClass
@SuppressWarnings("PMD.ClassNamingConventions")
public final class TagFactory {

  private static final Map<Pair<String, MethodMode>, Constructor<Tag>> TAGS =
      new ConcurrentHashMap<>();

  public static Tag createTag(final String tagName, final TagInit tagInit) {
    final var constructor = TAGS.get(Pair.of(tagName, tagInit.conversionContext().getMethodMode()));
    try {
      return constructor == null
          ? getUndefinedTag(tagName, tagInit)
          : createTagInstanceAndValidate(tagInit, constructor);
    } catch (InvocationTargetException | InstantiationException | IllegalAccessException e) {
      throw new TagInstantiationException(e);
    }
  }

  private static Tag createTagInstanceAndValidate(
      final TagInit tagInit, final Constructor<Tag> constructor)
      throws InvocationTargetException, InstantiationException, IllegalAccessException {
    final Tag tagInstance = constructor.newInstance(tagInit);
    ValidationUtil.validate(tagInstance, tagInit.conversionContext());
    return tagInstance;
  }

  private static UndefinedTag getUndefinedTag(final String tagName, final TagInit tagInit) {
    tagInit
        .conversionContext()
        .addMessage(
            ERROR, String.format("No parser defined for tag [%s]", tagName), tagInit.getPosition());
    return new UndefinedTag(tagInit);
  }

  public static void register(
      final String tagName, final MethodMode mode, final Constructor<Tag> constructor) {
    LOGGER.info("Loading {} for {}", tagName, mode);
    TAGS.put(Pair.of(tagName, mode), constructor);
  }
}
