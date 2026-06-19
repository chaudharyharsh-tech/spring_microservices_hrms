package springmvc.config;


import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan(basePackages = {"springmvc.service", "springmvc.dao", "springmvc.model"})
// We use @Import to explicitly wire our infrastructure configurations together
//@Import(DatabaseConfig.class)
public class RootConfig {

}
