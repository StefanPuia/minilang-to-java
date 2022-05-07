package co.uk.stefanpuia.minilang2java.core.qualify;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;
import org.immutables.value.Value.Parameter;

@Immutable
@ImmutableStyle
public abstract class QualifiedClass {
  private static final Pattern QUALIFIED_PATTERN =
      Pattern.compile("^(?<package>.*?)\\.?(?<class>\\w+)$");
  private static final List<Object> DEFAULT_PACKAGES = List.of("java.lang");

  public static QualifiedClass from(final String qualifiedName) {
    final Matcher matcher = getClassNameMatcher(qualifiedName);
    return matcher.find() ? split(matcher) : ImmutableQualifiedClass.of("", qualifiedName);
  }

  private static QualifiedClass split(final Matcher matcher) {
    return ImmutableQualifiedClass.of(matcher.group("package"), matcher.group("class"));
  }

  private static Matcher getClassNameMatcher(final String qualifiedName) {
    return QUALIFIED_PATTERN.matcher(qualifiedName);
  }

  @Parameter(order = 1)
  protected abstract String getRawPackageName();

  @Parameter(order = 2)
  protected abstract String getRawClassName();

  @Derived
  public Optional<String> getPackageName() {
    return Stream.of(
            OptionalString.of(getRawPackageName()),
            Optional.ofNullable(QualificationUtil.QUALIFICATION_MAP.get(getRawClassName())))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .findFirst();
  }

  @Derived
  public Optional<String> getClassName() {
    return OptionalString.of(getRawClassName());
  }

  public String qualify() {
    return Stream.of(getPackageName(), getClassName())
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.joining("."));
  }

  public boolean isRequiresImport(final String currentPackage) {
    return getPackageName().map(name -> !DEFAULT_PACKAGES.contains(name)).orElse(true)
        && getPackageName().map(name -> !currentPackage.equals(name)).orElse(true);
  }
}
