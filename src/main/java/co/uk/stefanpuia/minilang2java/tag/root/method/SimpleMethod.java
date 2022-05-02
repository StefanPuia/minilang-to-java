package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyAttributeValueRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ValidationRule;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public abstract class SimpleMethod extends Tag {

  public static final String SIMPLE_METHOD = "simple-method";
  public static final String DEFAULT_GENERATED_METHOD_NAME = "generatedMethodName";
  protected final List<MethodContextVariable> methodContextVariables = new ArrayList<>();

  public SimpleMethod(final TagInit tagInit) {
    super(tagInit);
    addMethodVariablesToContext();
  }

  @Override
  public List<String> convert() {
    final List<String> output = new ArrayList<>();
    output.add(getMethodHeader());
    output.addAll(getDefaultAssignments());
    output.addAll(this.convertChildren().stream().map(this::prependIndentation).toList());
    output.add("}");
    return output;
  }

  @Override
  public List<ValidationRule> getRules() {
    final var rules = new ArrayList<>(super.getRules());
    rules.add(
        ImmutableAttributeNameRule.builder()
            .addRequiredAll("method-name")
            .addOptional("short-description")
            .build());
    rules.add(new NonEmptyAttributeValueRule("method-name", VALIDATION_WARNING));
    return rules;
  }

  private String getMethodHeader() {
    return String.join(
            "",
            Stream.of(
                    "public ",
                    getReturnType(),
                    " ",
                    getMethodName(),
                    "(",
                    getParameters(),
                    ") ",
                    getThrows(),
                    " {")
                .filter(str -> !str.isEmpty())
                .toList())
        .replaceAll("\\s{2,}", " ");
  }

  protected String getThrows() {
    return " ";
  }

  protected abstract String getParameters();

  protected String getMethodName() {
    return OptionalString.of(element.getAttribute("method-name"))
        .orElse(DEFAULT_GENERATED_METHOD_NAME);
  }

  protected abstract String getReturnType();

  protected abstract void addMethodVariablesToContext();

  protected abstract List<String> getDefaultAssignments();

  @Override
  protected boolean hasOwnContext() {
    return true;
  }
}
