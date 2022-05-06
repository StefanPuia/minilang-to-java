package co.uk.stefanpuia.minilang2java.core.model;

import co.uk.stefanpuia.minilang2java.tag.Tag;

public record ContextVariable(String name, int count, VariableType type) {
  public static boolean isDeclared(final Tag tag, final String field) {
    return tag.getVariable(field).map(ContextVariable::count).map(count -> count > 0).orElse(false);
  }

  public ContextVariable addCount(final int add) {
    return new ContextVariable(name(), count() + add, type());
  }

  public ContextVariable withCount(final int count) {
    return new ContextVariable(name(), count, type());
  }
}
