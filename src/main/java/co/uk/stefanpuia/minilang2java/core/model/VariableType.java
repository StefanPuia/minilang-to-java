package co.uk.stefanpuia.minilang2java.core.model;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import co.uk.stefanpuia.minilang2java.core.qualify.QualifiedClass;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
public abstract class VariableType {

  public static final VariableType DEFAULT_MAP_TYPE;
  public static final VariableType DEFAULT_TYPE;
  private static final Pattern TYPE_WITH_PARAMS_PATTERN;

  static {
    TYPE_WITH_PARAMS_PATTERN = Pattern.compile("^(?<type>.+?)(?:<(?<params>.*?)>)?$");
    DEFAULT_TYPE = VariableType.from("java.lang.Object");
    DEFAULT_MAP_TYPE = VariableType.from("java.util.Map<java.lang.String, java.lang.Object>");
  }

  public static VariableType from(@NotNull final String type) {
    return ImmutableVariableType.builder().setRawType(type).build();
  }

  protected abstract String getRawType();

  @Derived
  public QualifiedClass getType() {
    final Matcher paramsMatcher = getParamsMatcher();
    return QualifiedClass.from(paramsMatcher.find() ? paramsMatcher.group("type") : getRawType());
  }

  @Derived
  public List<VariableType> getParameters() {
    final Matcher paramsMatcher = getParamsMatcher();
    return paramsMatcher.find() ? getMatchedParams(paramsMatcher) : List.of();
  }

  @Derived
  @Override
  public String toString() {
    final String baseType = getType().getClassName().orElse("Void");
    return getParameters().isEmpty()
        ? baseType
        : String.format(
            "%s<%s>",
            baseType,
            getParameters().stream()
                .map(VariableType::getType)
                .map(QualifiedClass::getClassName)
                .map(optional -> optional.orElse("Void"))
                .collect(Collectors.joining(", ")));
  }

  private List<VariableType> getMatchedParams(final Matcher paramsMatcher) {
    return Arrays.stream(OptionalString.of(paramsMatcher.group("params")).orElse("").split(","))
        .map(String::trim)
        .filter(OptionalString::isNotEmpty)
        .map(VariableType::from)
        .toList();
  }

  private Matcher getParamsMatcher() {
    return TYPE_WITH_PARAMS_PATTERN.matcher(getRawType());
  }
}
