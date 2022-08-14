package co.uk.stefanpuia.minilang2java.core.qualify;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.experimental.UtilityClass;

@SuppressWarnings("PMD.AvoidDuplicateLiterals")
@UtilityClass
public final class QualificationUtil {
  public static final Map<String, String> QUALIFICATION_MAP;

  static {
    QUALIFICATION_MAP = new ConcurrentHashMap<>();
    QUALIFICATION_MAP.put("AbstractGuiceService", "com.stannah.service.engine");
    QUALIFICATION_MAP.put("ArrayList", "java.util");
    QUALIFICATION_MAP.put("BigDecimal", "java.math");
    QUALIFICATION_MAP.put("Boolean", "java.lang");
    QUALIFICATION_MAP.put("Date", "java.sql");
    QUALIFICATION_MAP.put("Debug", "org.ofbiz.base.util");
    QUALIFICATION_MAP.put("Delegator", "org.ofbiz.entity");
    QUALIFICATION_MAP.put("DelegatorFactory", "org.ofbiz.entity");
    QUALIFICATION_MAP.put("DispatchContext", "org.ofbiz.service");
    QUALIFICATION_MAP.put("Double", "java.lang");
    QUALIFICATION_MAP.put("EntityQuery", "org.ofbiz.entity.util");
    QUALIFICATION_MAP.put("EntityUtil", "org.ofbiz.entity.util");
    QUALIFICATION_MAP.put("EntityUtilProperties", "org.ofbiz.entity.util");
    QUALIFICATION_MAP.put("Entry", "java.util.Map");
    QUALIFICATION_MAP.put("ExecutionServiceException", "org.ofbiz.service");
    QUALIFICATION_MAP.put("GenericEntityException", "org.ofbiz.entity");
    QUALIFICATION_MAP.put("GenericServiceException", "org.ofbiz.service");
    QUALIFICATION_MAP.put("GenericTransactionException", "org.ofbiz.entity.transaction");
    QUALIFICATION_MAP.put("GenericValue", "org.ofbiz.entity");
    QUALIFICATION_MAP.put("HashMap", "java.util");
    QUALIFICATION_MAP.put("HttpServletRequest", "javax.servlet.http");
    QUALIFICATION_MAP.put("HttpServletResponse", "javax.servlet.http");
    QUALIFICATION_MAP.put("Inject", "com.google.inject");
    QUALIFICATION_MAP.put("Integer", "java.lang");
    QUALIFICATION_MAP.put("java.util.Date", "java.util");
    QUALIFICATION_MAP.put("List", "java.util");
    QUALIFICATION_MAP.put("LocalDate", "java.time");
    QUALIFICATION_MAP.put("LocalDateTime", "java.time");
    QUALIFICATION_MAP.put("LocalDispatcher", "org.ofbiz.service");
    QUALIFICATION_MAP.put("Locale", "java.util");
    QUALIFICATION_MAP.put("LocalTime", "java.time");
    QUALIFICATION_MAP.put("Long", "java.lang");
    QUALIFICATION_MAP.put("Map", "java.util");
    QUALIFICATION_MAP.put("Math", "java.lang");
    QUALIFICATION_MAP.put("MessageFormat", "java.text");
    QUALIFICATION_MAP.put("Object", "java.lang");
    QUALIFICATION_MAP.put("ObjectType", "org.ofbiz.base.util");
    QUALIFICATION_MAP.put("Optional", "java.util");
    QUALIFICATION_MAP.put("Override", "java.lang");
    QUALIFICATION_MAP.put("Pattern", "java.util.regex");
    QUALIFICATION_MAP.put("PatternFactory", "org.ofbiz.base.util");
    QUALIFICATION_MAP.put("RoundingMode", "java.math");
    QUALIFICATION_MAP.put("ScriptUtil", "org.ofbiz.base.util");
    QUALIFICATION_MAP.put("Security", "org.ofbiz.security");
    QUALIFICATION_MAP.put("ServiceUtil", "org.ofbiz.service");
    QUALIFICATION_MAP.put("SimpleMapProcessor", "org.ofbiz.minilang");
    QUALIFICATION_MAP.put("String", "java.lang");
    QUALIFICATION_MAP.put("Time", "java.sql");
    QUALIFICATION_MAP.put("Timestamp", "java.sql");
    QUALIFICATION_MAP.put("TimeZone", "java.util");
    QUALIFICATION_MAP.put("TransactionUtil", "org.ofbiz.entity.transaction");
    QUALIFICATION_MAP.put("UtilDateTime", "org.ofbiz.base.util");
    QUALIFICATION_MAP.put("UtilMisc", "org.ofbiz.base.util");
    QUALIFICATION_MAP.put("UtilValidate", "org.ofbiz.base.util");
  }
}
