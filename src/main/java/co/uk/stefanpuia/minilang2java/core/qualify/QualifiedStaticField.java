package co.uk.stefanpuia.minilang2java.core.qualify;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;
import org.immutables.value.Value.Parameter;

@Immutable
@ImmutableStyle
public abstract class QualifiedStaticField {

  @Parameter(order = 1)
  protected abstract QualifiedClass getQualifiedClass();

  @Parameter(order = 2)
  protected abstract String getRawStaticField();

  @Derived
  public Optional<String> getPackageName() {
    return getQualifiedClass().getPackageName();
  }

  @Derived
  public Optional<String> getClassName() {
    return getQualifiedClass().getClassName();
  }

  @Derived
  public Optional<String> getStaticField() {
    return OptionalString.of(getRawStaticField());
  }

  public String qualify() {
    return Stream.of(Optional.of(getQualifiedClass().qualify()), getStaticField())
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.joining("."));
  }
}
