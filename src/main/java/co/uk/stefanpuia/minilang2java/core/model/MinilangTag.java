package co.uk.stefanpuia.minilang2java.core.model;

import static co.uk.stefanpuia.minilang2java.core.model.MethodMode.ANY;

import co.uk.stefanpuia.minilang2java.core.model.MinilangTag.MinilangTags;
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Repeatable(MinilangTags.class)
public @interface MinilangTag {
  String value();

  MethodMode mode() default ANY;

  boolean optimised() default false;

  @Target(ElementType.TYPE)
  @Retention(RetentionPolicy.RUNTIME)
  @interface MinilangTags {
    MinilangTag[] value();
  }
}
