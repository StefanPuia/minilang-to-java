package co.uk.stefanpuia.minilang2java.tag.misc;

import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.ArrayList;
import java.util.List;

public class UndefinedTag extends Tag {
  public UndefinedTag(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return children.size() > 0 ? multipleChildren() : singleLine();
  }

  private List<String> singleLine() {
    return List.of(format("// Unparsed tag [%s]:%s", this.getTagName(), this.position.line()));
  }

  private List<String> multipleChildren() {
    final var converted = new ArrayList<String>();
    converted.add(format("// Begin unparsed tag [%s]:%s", this.getTagName(), this.position.line()));
    converted.addAll(convertChildren().stream().map(this::prependIndentation).toList());
    converted.add(format("// End unparsed tag [%s]", this.getTagName()));
    return converted;
  }
}
