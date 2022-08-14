package co.uk.stefanpuia.minilang2java.tag.callop;

import static co.uk.stefanpuia.minilang2java.core.handler.method.variable.userlogin.UserLogin.VAR_USER_LOGIN;
import static co.uk.stefanpuia.minilang2java.core.model.MessageType.ERROR;
import static co.uk.stefanpuia.minilang2java.core.model.VariableType.DEFAULT_MAP_TYPE;
import static co.uk.stefanpuia.minilang2java.util.ListUtil.combine;

import co.uk.stefanpuia.minilang2java.core.TagInit;
import co.uk.stefanpuia.minilang2java.core.field.FlexibleAccessor;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableAttributeNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.ImmutableChildTagNameRule;
import co.uk.stefanpuia.minilang2java.core.validate.rule.RuleList;
import co.uk.stefanpuia.minilang2java.core.value.FlexibleStringExpander;
import co.uk.stefanpuia.minilang2java.tag.Tag;
import co.uk.stefanpuia.minilang2java.tag.TagAttributes;
import co.uk.stefanpuia.minilang2java.tag.callop.result.Result;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public abstract class AbstractCallService extends Tag {

  private final Attributes attributes;

  public AbstractCallService(final TagInit tagInit) {
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
    final List<String> output = new ArrayList<>(getAuthentication());
    if (getChildren(Result.class).isEmpty()) {
      output.add(makeDispatcherCall());
    } else {
      output.addAll(
          combine(
              FlexibleAccessor.from(this, getResultName())
                  .makeSetter(DEFAULT_MAP_TYPE, makeDispatcherCall()),
              convertChildren()));
    }

    return output;
  }

  private List<String> getAuthentication() {
    final List<String> output = new ArrayList<>();

    if (attributes.isIncludeUserLogin() || context.isAuthenticateServices()) {
      attributes
          .getMapName()
          .ifPresentOrElse(
              map -> {
                this.setVariable(VAR_USER_LOGIN);
                this.setVariable("dispatcher");
                output.addAll(
                    FlexibleAccessor.from(this, "%s.userLogin".formatted(map.getField()))
                        .makeSetter(VAR_USER_LOGIN));
              },
              () ->
                  context.addMessage(
                      ERROR,
                      "Cannot authenticate service, no parameter map provided.",
                      getPosition()));
    }
    return output;
  }

  private String makeDispatcherCall() {
    return "dispatcher.runSync(%s)".formatted(getCallArguments());
  }

  private String getCallArguments() {
    return Stream.of(
            Optional.of(attributes.getServiceName().toSafeString()),
            getParameterMap(),
            getTransactionArguments())
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.joining(", "));
  }

  private Optional<String> getParameterMap() {
    return attributes.getMapName().map(FlexibleAccessor::makeGetter);
  }

  private Optional<String> getTransactionArguments() {
    return attributes.isRequireNewTransaction() || attributes.getTransactionTimeout().isPresent()
        ? Optional.of(
            String.join(
                ", ",
                attributes.getTransactionTimeout().map(String::valueOf).orElse("60"),
                String.valueOf(attributes.isRequireNewTransaction())))
        : Optional.empty();
  }

  public String getResultName() {
    return "%sResult".formatted(attributes.getServiceName());
  }

  protected static class Attributes extends TagAttributes {

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
