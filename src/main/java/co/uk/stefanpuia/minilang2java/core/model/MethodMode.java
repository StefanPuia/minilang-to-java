package co.uk.stefanpuia.minilang2java.core.model;

public enum MethodMode {
  UTIL,
  EVENT,
  SERVICE,
  GUICE_SERVICE,
  ANY;

  public static final MethodMode[] MODES = {UTIL, EVENT, SERVICE, GUICE_SERVICE};
}
