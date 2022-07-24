package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.util.StreamUtil.filterOutTypes;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public abstract class ConditionalTag extends Tag {

  public ConditionalTag(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    final List<String> lines = new ArrayList<>();
    lines.add(format("if (%s) {", convertCondition()));
    lines.addAll(getThenLines());
    addElseIfsLines(lines);
    addElseLines(lines);
    lines.add("}");
    return lines;
  }

  private void addElseIfsLines(final List<String> lines) {
    getElseIfChildren()
        .forEach(
            elseIf -> {
              lines.add(format("} else if (%s) {", elseIf.convertCondition()));
              lines.addAll(elseIf.getThenLines().stream().map(this::prependIndentation).toList());
            });
  }

  private void addElseLines(final List<String> lines) {
    getElseChild()
        .ifPresent(
            elseChild -> {
              lines.add("} else {");
              lines.addAll(
                  elseChild.convertChildren().stream().map(this::prependIndentation).toList());
            });
  }

  protected abstract List<String> getThenLines();

  protected abstract String convertCondition();

  protected Optional<Condition> getConditionChild() {
    return getOptionalFirstChild(Condition.class);
  }

  protected Optional<Then> getThenChild() {
    return getOptionalFirstChild(Then.class);
  }

  protected List<ElseIf> getElseIfChildren() {
    return getChildren(ElseIf.class);
  }

  protected Optional<Else> getElseChild() {
    return getOptionalFirstChild(Else.class);
  }

  protected List<Tag> getNonConditionalOpsChildren() {
    return filterOutTypes(children.stream(), ConditionalOp.class).toList();
  }
}
