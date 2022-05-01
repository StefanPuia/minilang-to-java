package co.uk.stefanpuia.minilang2java.tag.root.method;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import java.util.List;
import net.bytebuddy.utility.RandomString;

public class GeneratedMethod extends SimpleMethod {

  private final String methodName;

  public GeneratedMethod(final TagInit tagInit) {
    super(tagInit);
    methodName = "generatedMethod_" + RandomString.make();
  }

  public static GeneratedMethod createTag(
      final ConversionContext conversionContext, final Tag parent) {
    return new GeneratedMethod(new TagInit(conversionContext, new SimpleMethodElement(), parent));
  }

  @Override
  protected String getParameters() {
    return "";
  }

  @Override
  protected String getReturnType() {
    return "void";
  }

  @Override
  protected void addMethodVariablesToContext() {}

  @Override
  protected List<String> getDefaultAssignments() {
    return List.of();
  }

  @Override
  public String getMethodName() {
    return methodName;
  }
}
