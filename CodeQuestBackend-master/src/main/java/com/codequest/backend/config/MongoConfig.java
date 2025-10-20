package com.codequest.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.client.MongoClients;

@Configuration
@EnableMongoRepositories(basePackages = "com.codequest.backend.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "codequestdb";
    }

    @Bean
    @Override
    public com.mongodb.client.MongoClient mongoClient() {
        return MongoClients.create("mongodb+srv://akashadak0029:gvJDbw4gxm4TwEUw@cluster0.vveoupu.mongodb.net/codequestdb?retryWrites=true&w=majority&appName=Cluster0");
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
}
