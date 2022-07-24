package co.uk.stefanpuia.minilang2java.tag.root;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.WARNING;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.misc.Comment;
import co.uk.stefanpuia.minilang2java.tag.root.method.GeneratedMethod;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;
import java.util.ArrayList;
import java.util.List;

@MinilangTag("xml-root")
public class XmlRoot extends Tag {

  public XmlRoot(final TagInit tagInit) {
    super(tagInit);
  }

  private void wrapWithSimpleMethod() {
    if (children.stream().anyMatch(this::tagIsNotRootAllowedElement)) {
      context.addMessage(
          WARNING,
          "Elements found outside a [simple-method] tag. A wrapper method will be generated.");
      final var method = GeneratedMethod.createTag(context, this, getElement().getOwnerDocument());
      children.stream()
          .filter(this::tagIsNotRootAllowedElement)
          .forEach(
              child -> {
                method.appendChild(child);
                child.setParent(method);
              });
      children.removeIf(this::tagIsNotRootAllowedElement);
      appendChild(method);
    }
  }

  private boolean tagIsNotRootAllowedElement(final Tag tag) {
    return !SimpleMethod.class.isAssignableFrom(tag.getClass())
        && !Comment.class.isAssignableFrom(tag.getClass());
  }

  @Override
  public List<String> convertSelf() {
    wrapWithSimpleMethod();
    final List<String> output = new ArrayList<>();
    final List<String> children =
        this.convertChildren().stream().map(this::prependIndentation).toList();
    output.add(getPackage());
    output.add("");
    output.addAll(getImports());
    output.add("");
    output.addAll(getStaticImports());
    output.add("");
    output.add(getClassLine());
    output.addAll(children);
    output.add("}");
    return output;
  }

  private List<String> getStaticImports() {
    return context.getStaticImports().stream()
        .sorted()
        .map(line -> format("import static %s;", line))
        .toList();
  }

  private List<String> getImports() {
    return context.getImports().stream().sorted().map(line -> format("import %s;", line)).toList();
  }

  private String getPackage() {
    return format("package %s;%n", context.getPackageName());
  }

  private String getClassLine() {
    return format("public class %s {", context.getClassName());
  }

  @Override
  protected boolean hasOwnContext() {
    return true;
  }

  @Override
  public List<String> convertChildren() {
    return this.children.stream()
        .map(
            child -> {
              final var converted = convertTagWithExceptionHandled(child);
              return Comment.class.isAssignableFrom(child.getClass())
                  ? converted
                  : prependNewLine(converted);
            })
        .flatMap(List::stream)
        .toList();
  }

  private List<String> prependNewLine(final List<String> list) {
    return combine("", list);
  }
}
