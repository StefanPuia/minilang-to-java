package co.uk.stefanpuia.minilang2java.core.model;

import java.util.List;

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
  GUICE_SERVICE {
    @Override
    public String toString() {
      return "Guice Service";
    }
  },
  ANY;

  public static final List<MethodMode> MODES = List.of(UTIL, EVENT, SERVICE, GUICE_SERVICE);
}
