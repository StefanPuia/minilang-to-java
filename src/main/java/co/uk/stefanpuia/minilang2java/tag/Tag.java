package co.uk.stefanpuia.minilang2java.tag;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.model.ContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.Position;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.w3c.dom.Element;

public abstract class Tag {
  protected final ConversionContext conversionContext;
  protected final Element element;

  @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
  protected final Optional<Tag> parent;

  protected final List<Tag> children = new ArrayList<>();

  protected final Position position;

  protected final Map<String, ContextVariable> variableContext = new ConcurrentHashMap<>();

  public Tag(final TagInit tagInit) {
    this.conversionContext = tagInit.conversionContext();
    this.element = tagInit.element();
    this.parent = Optional.ofNullable(tagInit.parent());
    this.position = tagInit.getPosition();
  }

  public abstract List<String> convert();

  public List<String> convertChildren() {
    return this.children.stream().map(Tag::convert).flatMap(List::stream).toList();
  }

  public final void appendChild(final Tag tag) {
    this.children.add(tag);
  }

  public String prependIndentation(final String line) {
    return line.isBlank()
        ? ""
        : String.format("%s%s", conversionContext.getBaseIndentation(), line);
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
  protected <T extends Tag> Optional<T> getParent(final Class<T> parentType) {
    if (parent.isPresent()) {
      if (parentType.isAssignableFrom(parent.get().getClass())) {
        return (Optional<T>) parent;
      } else {
        return parent.get().getParent(parentType);
      }
    }
    return Optional.empty();
  }

  public String getTagName() {
    return element.getTagName();
  }
}
