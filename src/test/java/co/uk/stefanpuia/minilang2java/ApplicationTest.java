package co.uk.stefanpuia.minilang2java;

import static org.assertj.core.api.BDDAssertions.then;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest(
    classes = {Application.class},
    webEnvironment = RANDOM_PORT)
class ApplicationTest {
  @Autowired private Application application;

  @Autowired private ApplicationContext context;

  @Test
  void applicationShouldStart() {
    then(application).isNotNull();
    then(context).isNotNull();
  }
}
