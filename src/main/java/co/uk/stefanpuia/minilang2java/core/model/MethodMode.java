package co.uk.stefanpuia.minilang2java.core.model;

public enum MethodMode {
  UTIL {
    @Override
    public String toString() {
      return "Utility";
    }
  },
  EVENT {
    @Override
    public String toString() {
      return "Event";
    }
  },
  SERVICE {
    @Override
    public String toString() {
      return "Service";
    }
  },
  ANY,
}
