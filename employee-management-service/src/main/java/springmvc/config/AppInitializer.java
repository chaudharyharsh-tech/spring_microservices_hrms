package springmvc.config;

import org.jspecify.annotations.NullMarked;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return new Class[] {RootConfig.class, DatabaseConfig.class, KafkaConfig.class};
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class[] { WebConfig.class };
	}

	@NullMarked
	@Override
	protected String[] getServletMappings() {
		return new String[] { "/" };
	}
}
