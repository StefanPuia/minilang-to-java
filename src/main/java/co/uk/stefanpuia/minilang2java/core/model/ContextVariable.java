package co.uk.stefanpuia.minilang2java.core.model;

public record ContextVariable(String name, int count, VariableType type) {
  public ContextVariable addCount(final int add) {
    return new ContextVariable(name(), count() + add, type());
  }

  public ContextVariable withCount(final int count) {
    return new ContextVariable(name(), count, type());
  }
}
