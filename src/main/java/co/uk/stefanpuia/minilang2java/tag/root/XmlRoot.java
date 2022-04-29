package co.uk.stefanpuia.minilang2java.tag.root;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.ArrayList;
import java.util.List;

@MinilangTag("xml-root")
public class XmlRoot extends Tag {

  public XmlRoot(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convert() {
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
    return conversionContext.getStaticImports().stream()
        .sorted()
        .map(line -> format("import static %s;", line))
        .toList();
  }

  private List<String> getImports() {
    return conversionContext.getImports().stream()
        .sorted()
        .map(line -> format("import %s;", line))
        .toList();
  }

  private String getPackage() {
    return format("package %s;%n", conversionContext.getPackageName());
  }

  private String getClassLine() {
    return format("public class %s {", conversionContext.getClassName());
  }

  @Override
  protected boolean hasOwnContext() {
    return true;
  }
}
