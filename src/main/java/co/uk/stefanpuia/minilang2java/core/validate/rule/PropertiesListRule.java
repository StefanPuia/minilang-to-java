package co.uk.stefanpuia.minilang2java.core.validate.rule;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public interface PropertiesListRule extends ValidationRule {
  List<String> getRequiredAll();

  List<List<String>> getRequiredOneOf();

  List<String> getOptional();

  List<String> getDeprecated();

  List<String> getUnhandled();

  default Set<String> getAll() {
    final var set = new HashSet<String>();
    set.addAll(getRequiredAll());
    set.addAll(getRequiredOneOf().stream().flatMap(List::stream).toList());
    set.addAll(getOptional());
    set.addAll(getDeprecated());
    set.addAll(getUnhandled());
    return set;
  }
}
