package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.util.StreamUtil.filterTypes;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

public abstract class ConditionGroup extends Tag implements ConditionalOp, IfOp {
  public ConditionGroup(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convertSelf() {
    return List.of(convertCondition());
  }

  @Override
  public String convertCondition() {
    return parent.map(Tag::getClass).map(ConditionGroup.class::isAssignableFrom).orElse(false)
        ? convertWrap()
        : convertNoWrap();
  }

  private String convertNoWrap() {
    return String.join(String.format(" %s ", getConditionalOperator()), convertChildren());
  }

  private String convertWrap() {
    final String joinChars = String.format(" %s ", getConditionalOperator());
    return String.format("(%s)", String.join(joinChars, convertChildren()));
  }

  protected abstract String getConditionalOperator();

  @Override
  public List<String> convertChildren() {
    return filterTypes(children.stream(), IfOp.class).map(IfOp::convertCondition).toList();
  }
}
