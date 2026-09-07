package com.chaudharyharsh;

import com.chaudharyharsh.salaryserver.SalaryAccountServer;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class ApplicationStarter implements ServletContextListener {

    private SalaryAccountServer grpcServer;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try{
            grpcServer = new SalaryAccountServer(8980);
            grpcServer.start();
            grpcServer.blockUntilShutdown();
        } catch(Exception e) {
            throw new RuntimeException("Failed to start gRPC server");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if(grpcServer != null) {
            try {
                grpcServer.stop();
            } catch(InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
