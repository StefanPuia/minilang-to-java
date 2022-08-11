package co.uk.stefanpuia.minilang2java.tag.callop;

import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.model.MinilangTag;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import co.uk.stefanpuia.minilang2java.tag.callop.result.Result;
import java.util.List;
import java.util.Optional;

@MinilangTag("call-service")
public class CallService extends Tag {

  private final Attributes attributes;

  public CallService(final TagInit tagInit) {
    super(tagInit);
    this.attributes = new Attributes(this);
  }

  @Override
  public RuleList getRules() {
    return super.getRules()
        .addRules(
            ImmutableAttributeNameRule.builder()
                .addRequiredAll("service-name")
                .addOptional(
                    "in-map-name",
                    "include-user-login",
                    "break-on-error",
                    "error-code",
                    "require-new-transaction",
                    "transaction-timeout",
                    "success-code")
                .build(),
            ImmutableChildTagNameRule.builder()
                .addOptional(
                    "error-prefix",
                    "error-suffix",
                    "success-prefix",
                    "success-suffix",
                    "message-prefix",
                    "message-suffix",
                    "default-message",
                    "results-to-map",
                    "result-to-field",
                    "result-to-request",
                    "result-to-session",
                    "result-to-result")
                .build());
  }

  @Override
  protected List<String> convertSelf() {
    if (getChildren(Result.class).isEmpty()) {
      return List.of(makeDispatcherCall());
    }
    return combine(
        FlexibleAccessor.from(this, getResultName())
            .makeSetter(DEFAULT_MAP_TYPE, makeDispatcherCall()),
        convertChildren());
  }

  private String makeDispatcherCall() {
    return "dispatcher.runSync(\"%s\")".formatted(attributes.getServiceName());
  }

  public String getResultName() {
    return "%sResult".formatted(attributes.getServiceName());
  }

  private static class Attributes extends TagAttributes {

    protected Attributes(final Tag self) {
      super(self);
    }

    public FlexibleStringExpander getServiceName() {
      return stringExpander("service-name");
    }

    public Optional<FlexibleAccessor> getMapName() {
      return optionalFlexibleAccessor("in-map-name");
    }

    public boolean isIncludeUserLogin() {
      return bool("include-user-login");
    }

    public boolean isBreakOnError() {
      return bool("break-on-error");
    }

    public Optional<String> getErrorCode() {
      return get("error-code");
    }

    public boolean isRequireNewTransaction() {
      return bool("require-new-transaction");
    }

    public Optional<Integer> getTransactionTimeout() {
      return get("transaction-timeout").map(Integer::parseInt);
    }

    public Optional<String> getSuccessCode() {
      return get("success-code");
    }
  }
}
