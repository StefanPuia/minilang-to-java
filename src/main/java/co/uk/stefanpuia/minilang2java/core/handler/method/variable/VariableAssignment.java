package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

public interface VariableAssignment {
  default String getAssignment(final String type, final String name, final String assignment) {
    return String.format("final %s %s = %s;", type, name, assignment);
  }
}
