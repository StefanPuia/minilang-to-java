package co.uk.stefanpuia.minilang2java.core.qualify;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.experimental.UtilityClass;

@UtilityClass
public final class QualificationUtil {
  public static final Map<String, String> QUALIFICATION_MAP;

  static {
    QUALIFICATION_MAP = new ConcurrentHashMap<>();
    QUALIFICATION_MAP.put("DispatchContext", "org.ofbiz.service");
    QUALIFICATION_MAP.put("HttpServletRequest", "javax.servlet.http");
    QUALIFICATION_MAP.put("HttpServletResponse", "javax.servlet.http");
    QUALIFICATION_MAP.put("Map", "java.util");
  }
}
