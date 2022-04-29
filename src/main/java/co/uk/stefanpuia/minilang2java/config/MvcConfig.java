package co.uk.stefanpuia.minilang2java.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

  @Bean
  public FreeMarkerViewResolver freemarkerViewResolver() {
    final FreeMarkerViewResolver resolver = new FreeMarkerViewResolver();
    resolver.setCache(true);
    resolver.setSuffix(".ftl");
    return resolver;
  }

  @Override
  public void addViewControllers(final ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("index");
  }
}
