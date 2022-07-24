package co.uk.stefanpuia.minilang2java.core.model;

import static java.util.function.Predicate.not;

import co.uk.stefanpuia.minilang2java.config.ImmutableStyle;
import co.uk.stefanpuia.minilang2java.core.model.exception.VariableParseException;
import co.uk.stefanpuia.minilang2java.core.qualify.QualifiedClass;
import java.io.IOException;
import java.io.StreamTokenizer;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import org.immutables.value.Value.Derived;
import org.immutables.value.Value.Immutable;

@Immutable
@ImmutableStyle
public abstract class VariableType {

  public static final VariableType DEFAULT_MAP_TYPE;
  public static final VariableType DEFAULT_TYPE;
  public static final char CHAR_LESS_THAN = '<';
  public static final char CHAR_COMMA = ',';
  public static final char CHAR_POINT = '.';

  static {
    DEFAULT_TYPE = VariableType.from("java.lang.Object");
    DEFAULT_MAP_TYPE = VariableType.from("java.util.Map<java.lang.String, java.lang.Object>");
  }

  public static VariableType from(@NotNull final String type) {
    final var tokenizer = new StreamTokenizer(new StringReader(type));
    tokenizer.wordChars(CHAR_POINT, CHAR_POINT);
    try {
      tokenizer.nextToken();
      return parse(tokenizer);
    } catch (IOException e) {
      throw new VariableParseException(e);
    }
  }

  private static VariableType parse(final StreamTokenizer tokenizer) throws IOException {
    final String baseName = tokenizer.sval;
    tokenizer.nextToken();
    final List<VariableType> params = new ArrayList<>();
    if (tokenizer.ttype == CHAR_LESS_THAN) {
      do {
        tokenizer.nextToken();
        params.add(parse(tokenizer));
      } while (tokenizer.ttype == CHAR_COMMA);
      tokenizer.nextToken();
    }
    return ImmutableVariableType.builder()
        .setType(QualifiedClass.from(OptionalString.of(baseName).orElse("")))
        .setParameters(
            params.stream().filter(not(VariableType::isEmpty)).collect(Collectors.toList()))
        .build();
  }

  @Derived
  public boolean isEmpty() {
    return getType().isEmpty();
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
            getParameters().stream().map(VariableType::toString).collect(Collectors.joining(", ")));
  }

  public abstract QualifiedClass getType();

  public abstract List<VariableType> getParameters();
}
