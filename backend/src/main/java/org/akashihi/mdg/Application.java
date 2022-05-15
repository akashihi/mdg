package org.akashihi.mdg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
@EnableElasticsearchRepositories(basePackages = "org.akashihi.mdg.indexing")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
