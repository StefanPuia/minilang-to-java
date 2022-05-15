package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.util.StreamUtil.filterOutTypes;
import static co.uk.stefanpuia.minilang2java.util.StreamUtil.filterTypes;
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
  public List<String> convert() {
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
    return filterTypes(children.stream(), Condition.class).findFirst();
  }

  protected Optional<Then> getThenChild() {
    return filterTypes(children.stream(), Then.class).findFirst();
  }

  protected List<ElseIf> getElseIfChildren() {
    return filterTypes(children.stream(), ElseIf.class).toList();
  }

  protected Optional<Else> getElseChild() {
    return filterTypes(children.stream(), Else.class).findFirst();
  }

  protected List<Tag> getNonConditionalOpsChildren() {
    return filterOutTypes(children.stream(), ConditionalOp.class).toList();
  }
}
