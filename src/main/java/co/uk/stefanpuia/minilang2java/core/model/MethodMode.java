package co.uk.stefanpuia.minilang2java.core.model;

import java.util.List;

public enum MethodMode {
  UTIL,
  EVENT,
  SERVICE,
  GUICE_SERVICE,
  ANY;

  public static final List<MethodMode> MODES = List.of(UTIL, EVENT, SERVICE, GUICE_SERVICE);
}
