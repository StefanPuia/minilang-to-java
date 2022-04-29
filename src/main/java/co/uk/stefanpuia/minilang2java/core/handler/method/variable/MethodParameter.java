package co.uk.stefanpuia.minilang2java.core.handler.method.variable;

public interface MethodParameter {
  default String getMethodParameter(final String type, final String name) {
    return String.format("final %s %s", type, name);
  }
}
