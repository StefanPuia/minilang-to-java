package co.uk.stefanpuia.minilang2java;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@SpringBootApplication(
    exclude = {
      DataSourceAutoConfiguration.class,
      DataSourceTransactionManagerAutoConfiguration.class,
      HibernateJpaAutoConfiguration.class
    })
public class Application {

  public static void main(final String[] args) {
    //noinspection resource
    SpringApplication.run(Application.class, args);
  }
}
