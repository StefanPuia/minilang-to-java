package co.uk.stefanpuia.minilang2java.tag.root.method;

import static co.uk.stefanpuia.minilang2java.core.model.MessageType.VALIDATION_WARNING;
import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.convertTagsPrepend;
import static co.uk.stefanpuia.minilang2java.util.ConvertUtil.indent;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.OptionalString;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.NonEmptyIfPresentAttributeValueRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.callop.returnop.Return;
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
  public List<String> convertSelf() {
    final List<String> output = new ArrayList<>();
    final List<String> children = convertTagsPrepend(this, getChildren());
    output.addAll(getMethodHeader());
    output.addAll(indent(this, getDefaultAssignments()));
    output.addAll(children);
    output.addAll(getReturnIfNeeded());
    output.add("}");
    return output;
  }

  private List<String> getReturnIfNeeded() {
    return getChildren(Return.class).isEmpty() ? indent(this, getReturn()) : List.of();
  }

  protected abstract List<String> getReturn();

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("method-name")
                .addOptional("short-description")
                .build(),
            new NonEmptyIfPresentAttributeValueRule("method-name", VALIDATION_WARNING));
  }

  protected List<String> getMethodHeader() {
    return List.of(
        String.join(
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
            .replaceAll("\\s{2,}", " "));
  }

  protected String getThrows() {
    return " ";
  }

  protected abstract String getParameters();

  public String getMethodName() {
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
