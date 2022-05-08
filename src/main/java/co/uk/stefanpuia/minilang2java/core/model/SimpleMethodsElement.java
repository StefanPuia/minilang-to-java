package co.uk.stefanpuia.minilang2java.core.model;

public record SimpleMethodsElement(String name, String description)
    implements Comparable<SimpleMethodsElement> {

  @Override
  public int compareTo(final SimpleMethodsElement compareTo) {
    return name().compareTo(compareTo.name());
  }
}
