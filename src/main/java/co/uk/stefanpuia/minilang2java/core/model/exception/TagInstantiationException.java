package co.uk.stefanpuia.minilang2java.core.model.exception;

public class TagInstantiationException extends RuntimeException {
  public TagInstantiationException(final Throwable cause) {
    super(cause);
  }

  public TagInstantiationException(final String message) {
    super(message);
  }
}
