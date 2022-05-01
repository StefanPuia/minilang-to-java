package co.uk.stefanpuia.minilang2java.controller.dto;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.immutables.value.Value.Default;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
@JsonDeserialize(as = ImmutableConversionRequestOptions.class)
@SuppressWarnings("PMD.AbstractClassWithoutAbstractMethod")
public abstract class ConversionRequestOptions {

  @Default
  @JsonAlias("editor.converter.tabSize")
  public int getTabSize() {
    return 2;
  }

  @Default
  @JsonAlias("editor.logging.deprecated")
  public boolean isLoggingDeprecated() {
    return true;
  }

  @Default
  @JsonAlias("editor.logging.info")
  public boolean isLoggingInfo() {
    return true;
  }

  @Default
  @JsonAlias("editor.logging.warning")
  public boolean isLoggingWarning() {
    return true;
  }

  @Default
  @JsonAlias("editor.logging.validation.error")
  public boolean isLoggingValidationError() {
    return true;
  }

  @Default
  @JsonAlias("editor.logging.validation.warning")
  public boolean isLoggingValidationWarning() {
    return true;
  }

  @Default
  @JsonAlias("editor.converter.authServices")
  public boolean isConverterAuthServices() {
    return true;
  }

  @Default
  @JsonAlias("editor.converter.replicateMinilang")
  public boolean isConverterReplicateMinilang() {
    return true;
  }
}
