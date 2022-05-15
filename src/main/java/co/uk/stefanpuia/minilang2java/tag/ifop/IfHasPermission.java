package co.uk.stefanpuia.minilang2java.tag.ifop;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.security.Security.VAR_SECURITY;
import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.UserLogin.VAR_USER_LOGIN;
import static java.lang.String.format;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.model.exception.TagInstantiationException;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.util.ConvertUtil;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;

@MinilangTag("if-has-permission")
public class IfHasPermission extends ConditionalTag implements IfOp {

  private final Attributes attributes;

  public IfHasPermission(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  protected List<String> getThenLines() {
    return ConvertUtil.convertTagsPrepend(this, getNonConditionalOpsChildren());
  }

  @Override
  public String convertCondition() {
    setVariable("userLogin");
    setVariable("security");
    final String permission = attributes.getPermission().toString();
    return attributes
        .getAction()
        .map(
            action ->
                format(
                    "%s.hasEntityPermission(%s, %s, %s)",
                    VAR_SECURITY, permission, action, VAR_USER_LOGIN))
        .orElseGet(
            () -> format("%s.hasPermission(%s, %s)", VAR_SECURITY, permission, VAR_USER_LOGIN));
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("permission")
                .addOptional("action")
                .build());
  }

  @AllArgsConstructor
  private class Attributes {
    private final IfHasPermission self;

    public FlexibleStringExpander getPermission() {
      return getAttribute("permission")
          .map(field -> new FlexibleStringExpander(self, field))
          .orElseThrow(() -> new TagInstantiationException("[permission] attribute is empty"));
    }

    public Optional<FlexibleStringExpander> getAction() {
      return getAttribute("action").map(field -> new FlexibleStringExpander(self, field));
    }
  }
}
