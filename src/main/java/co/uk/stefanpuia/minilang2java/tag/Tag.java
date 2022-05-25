package co.uk.stefanpuia.minilang2java.tag;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagConversionException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.util.StreamUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.Nullable;
import org.w3c.dom.Element;

public abstract class Tag {
  protected final ConversionContext context;
  protected final Element element;
  protected final List<Tag> children = new ArrayList<>();
  protected final Position position;
  protected final Map<String, ContextVariable> variableContext = new ConcurrentHashMap<>();

  @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
  protected Optional<Tag> parent;

  public Tag(final TagInit tagInit) {
    this.context = tagInit.conversionContext();
    this.element = tagInit.element();
    this.parent = Optional.ofNullable(tagInit.parent());
    this.position = tagInit.getPosition();
  }

  public abstract List<String> convert();

  public List<String> convertChildren() {
    return this.children.stream()
        .map(this::convertTagWithExceptionHandled)
        .flatMap(List::stream)
        .toList();
  }

  @SuppressWarnings({"PMD.OnlyOneReturn", "PMD.AvoidCatchingGenericException"})
  protected List<String> convertTagWithExceptionHandled(final Tag tag) {
    try {
      return tag.convert();
    } catch (Exception e) {
      return List.of(
          format(
              "// Exception converting [%s]: %s (%s)",
              tag.getTagName(), e.getMessage(), tag.getPosition()));
    }
  }

  public final void appendChild(final Tag tag) {
    this.children.add(tag);
  }

  public String prependIndentation(final String line) {
    return line.isBlank() ? "" : format("%s%s", context.getBaseIndentation(), line);
  }

  public Position getPosition() {
    return position;
  }

  public RuleList getRules() {
    return RuleList.empty();
  }

  public Element getElement() {
    return element;
  }

  public Optional<ContextVariable> getVariable(final String name) {
    return hasOwnContext()
        ? Optional.ofNullable(variableContext.get(name))
        : parent.flatMap(tag -> tag.getVariable(name));
  }

  public void setVariable(final ContextVariable variable) {
    if (hasOwnContext()) {
      final var currentVar = getVariable(variable.name());
      final int count = currentVar.map(ContextVariable::count).orElse(0);
      variableContext.put(variable.name(), variable.addCount(count));
    } else {
      parent.ifPresent(parentTag -> parentTag.setVariable(variable));
    }
  }

  public void setVariable(final String name) {
    setVariable(
        getVariable(name)
            .orElse(new ContextVariable(name, 0, VariableType.DEFAULT_TYPE))
            .withCount(1));
  }

  protected boolean hasOwnContext() {
    return false;
  }

  @SuppressWarnings({"unchecked", "PMD.OnlyOneReturn"})
  public <T extends Tag> Optional<T> getParent(final Class<T> parentType) {
    if (parent.isPresent()) {
      if (parentType.isAssignableFrom(parent.get().getClass())) {
        return (Optional<T>) parent;
      } else {
        return parent.get().getParent(parentType);
      }
    }
    return Optional.empty();
  }

  public <T extends Tag> Optional<T> getOptionalFirstChild(final Class<T> childType) {
    return StreamUtil.filterTypes(getChildren().stream(), childType).findFirst();
  }

  public <T extends Tag> T getFirstChild(final Class<T> childType) {
    return StreamUtil.filterTypes(getChildren().stream(), childType)
        .findFirst()
        .orElseThrow(
            () ->
                new TagConversionException(
                    format("No [%s] child found for tag [%s]", childType, getTagName())));
  }

  public <T extends Tag> List<T> getChildren(final Class<T> childType) {
    return StreamUtil.filterTypes(getChildren().stream(), childType).toList();
  }

  public String getTagName() {
    return element.getTagName();
  }

  public final List<Tag> getChildren() {
    return children;
  }

  protected Optional<String> getAttribute(final String name) {
    return OptionalString.of(element.getAttribute(name));
  }

  public ConversionContext getContext() {
    return context;
  }

  public void setParent(@Nullable final Tag parent) {
    this.parent = Optional.ofNullable(parent);
  }
}
