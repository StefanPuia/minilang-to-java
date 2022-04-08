// prettier-ignore
const importMap: Record<string, string> = {
    "com.stannah.base.entity.condition.EntityConditionBuilder": "EntityConditionBuilder",
    "com.stannah.base.utils.MiscUtils": "MiscUtils",
    "com.stannah.base.utils.ServiceExecutionUtil": "ServiceExecutionUtil",
    "com.stannah.external.hr.EmployeeUtils": "EmployeeUtils",
    "java.lang.Boolean": "Boolean",
    "java.lang.Double": "Double",
    "java.lang.Integer": "Integer",
    "java.lang.Long": "Long",
    "java.lang.Math": "Math",
    "java.lang.Object": "Object",
    "java.lang.String": "String",
    "java.math.BigDecimal": "BigDecimal",
    "java.math.RoundingMode": "RoundingMode",
    "java.sql.Date": "Date",
    "java.sql.Time": "Time",
    "java.sql.Timestamp": "Timestamp",
    "java.text.MessageFormat": "MessageFormat",
    "java.time.LocalDate": "LocalDate",
    "java.time.LocalDateTime": "LocalDateTime",
    "java.time.LocalTime": "LocalTime",
    "java.util.ArrayList": "ArrayList",
    "java.util.Date": "java.util.Date",
    "java.util.HashMap": "HashMap",
    "java.util.List": "List",
    "java.util.Locale": "Locale",
    "java.util.Map": "Map",
    "java.util.Optional": "Optional",
    "java.util.TimeZone": "TimeZone",
    "javax.servlet.http.HttpServletRequest": "HttpServletRequest",
    "javax.servlet.http.HttpServletResponse": "HttpServletResponse",
    "org.apache.oro.text.regex.Pattern": "Pattern",
    "org.apache.oro.text.regex.PatternMatcher": "PatternMatcher",
    "org.apache.oro.text.regex.Perl5Matcher": "Perl5Matcher",
    "org.ofbiz.base.util.Debug": "Debug",
    "org.ofbiz.base.util.ObjectType": "ObjectType",
    "org.ofbiz.base.util.PatternFactory": "PatternFactory",
    "org.ofbiz.base.util.ScriptUtil": "ScriptUtil",
    "org.ofbiz.base.util.UtilDateTime": "UtilDateTime",
    "org.ofbiz.base.util.UtilMisc": "UtilMisc",
    "org.ofbiz.base.util.UtilValidate": "UtilValidate",
    "org.ofbiz.entity.Delegator": "Delegator",
    "org.ofbiz.entity.GenericEntityException": "GenericEntityException",
    "org.ofbiz.entity.GenericValue": "GenericValue",
    "org.ofbiz.entity.transaction.GenericTransactionException": "GenericTransactionException",
    "org.ofbiz.entity.transaction.TransactionUtil": "TransactionUtil",
    "org.ofbiz.entity.util.EntityQuery": "EntityQuery",
    "org.ofbiz.entity.util.EntityUtil": "EntityUtil",
    "org.ofbiz.entity.util.EntityUtilProperties": "EntityUtilProperties",
    "org.ofbiz.minilang.SimpleMapProcessor": "SimpleMapProcessor",
    "org.ofbiz.service.DispatchContext": "DispatchContext",
    "org.ofbiz.service.ExecutionServiceException": "ExecutionServiceException",
    "org.ofbiz.service.GenericServiceException": "GenericServiceException",
    "org.ofbiz.service.LocalDispatcher": "LocalDispatcher",
    "org.ofbiz.service.ServiceUtil": "ServiceUtil",
};

export const qualify = (unqualified: string) => {
    return Object.entries(importMap).find(
        (entry) => entry[1] === unqualified
    )?.[0];
};

export const unqualify = (qualified: string) => {
    const className = importMap[qualified];
    return className ?? qualified;
};
