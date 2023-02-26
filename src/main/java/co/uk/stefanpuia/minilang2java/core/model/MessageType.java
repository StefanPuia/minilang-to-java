package co.uk.stefanpuia.minilang2java.core.model;

public enum MessageType {
  ERROR {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return true;
    }
  },
  WARNING {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.warning();
    }
  },
  INFO {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.info();
    }
  },
  TIMING {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.timing();
    }
  },
  DEPRECATE {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.deprecated();
    }
  },
  VALIDATION_ERROR {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.validationError();
    }
  },
  VALIDATION_WARNING {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.validationWarning();
    }
  },
  VALIDATION_DEPRECATE {
    @Override
    public boolean isEnabled(final LoggingConfig loggingConfig) {
      return loggingConfig.validationDeprecate();
    }
  },
  ;

  public abstract boolean isEnabled(LoggingConfig loggingConfig);
}
