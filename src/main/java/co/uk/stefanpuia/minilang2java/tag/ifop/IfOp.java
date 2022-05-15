package co.uk.stefanpuia.minilang2java.tag.ifop;

import java.util.List;

// Tag that yields a conditional expression (e.g. if, not, and, condition)
public interface IfOp extends ConditionalOp {
  List<String> convert();

  String convertCondition();
}
