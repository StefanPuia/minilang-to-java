package co.uk.stefanpuia.minilang2java.core.model;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.immutables.value.Value.Default;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
@SuppressWarnings("PMD.AbstractClassWithoutAbstractMethod")
@JsonDeserialize(as = ImmutableConverterOptions.class)
public abstract class ConverterOptions {
  @Default
  public boolean isAuthServices() {
    return false;
  }

  @Default
  public boolean isReplicateMinilang() {
    return false;
  }

  @Default
  protected int getTabSize() {
    return 2;
  }

  @Derived
  public int getIndentationSize() {
    return Math.max(getTabSize(), 2);
  }
}
