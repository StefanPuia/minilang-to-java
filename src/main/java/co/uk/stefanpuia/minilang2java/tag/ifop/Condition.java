package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.core.convert.StreamUtil.filterTypes;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;

@MinilangTag("condition")
public class Condition extends Tag implements ConditionalOp {

  public Condition(final TagInit tagInit) {
    super(tagInit);
  }

  @Override
  public List<String> convert() {
    return List.of(String.join(" && ", convertChildren()));
  }

  @Override
  public List<String> convertChildren() {
    return filterTypes(children.stream(), IfOp.class).map(IfOp::convertCondition).toList();
  }
}
