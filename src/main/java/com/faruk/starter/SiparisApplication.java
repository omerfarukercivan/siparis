package com.faruk.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan(basePackages = "com.faruk")
@ComponentScan(basePackages = "com.faruk")
@EnableJpaRepositories(basePackages = "com.faruk")
@SpringBootApplication
public class SiparisApplication {

	public static void main(String[] args) {
		SpringApplication.run(SiparisApplication.class, args);
	}
}