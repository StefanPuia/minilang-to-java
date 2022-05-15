package co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin;

import co.uk.stefanpuia.minilang2java.core.convert.context.ConversionContext;
import co.uk.stefanpuia.minilang2java.core.handler.method.variable.MethodContextVariable;
import co.uk.stefanpuia.minilang2java.core.model.VariableType;
import co.uk.stefanpuia.minilang2java.tag.root.method.SimpleMethod;

public abstract class UserLogin extends MethodContextVariable {

  public static final String VAR_USER_LOGIN = "userLogin";
  public static final VariableType TYPE_USER_LOGIN = VariableType.from("GenericValue");

  public UserLogin(final ConversionContext context, final SimpleMethod method) {
    super(context, method);
  }

  @Override
  public String getName() {
    return VAR_USER_LOGIN;
  }

  @Override
  public VariableType getType() {
    return TYPE_USER_LOGIN;
  }
}
