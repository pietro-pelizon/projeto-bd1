package uel.br.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry reg) {
        reg.addMapping("/**")  // Aplica a regra para todos os endpoints da API
        .allowedOrigins("*")    // libera requisições de qualquer endereço
        .allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS")
        .allowedHeaders("*");
    }
    
}
