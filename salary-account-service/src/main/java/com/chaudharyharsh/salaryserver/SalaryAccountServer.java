package com.chaudharyharsh.salaryserver;

import com.chaudharyharsh.salaryaccountservice.*;
import com.zaxxer.hikari.HikariDataSource;
import io.grpc.InsecureServerCredentials;
import io.grpc.Server;
import io.grpc.protobuf.services.ProtoReflectionService;
import io.grpc.stub.StreamObserver;
import io.micrometer.common.util.internal.logging.InternalLogger;
import io.micrometer.common.util.internal.logging.Slf4JLoggerFactory;

import javax.sql.DataSource;
import java.util.concurrent.TimeUnit;

import static io.grpc.Grpc.newServerBuilderForPort;


public class SalaryAccountServer {

    private static final InternalLogger logger = Slf4JLoggerFactory.getInstance(SalaryAccountServer.class);
    DataSource dataSource;

    private final int port;
    private final Server server;

    public SalaryAccountServer(HikariDataSource dataSource) {
        this(9001);
        this.dataSource = dataSource;
    }

    public SalaryAccountServer(int port) {
        this.port = port;
        server = newServerBuilderForPort(port, InsecureServerCredentials.create())
                .addService(ProtoReflectionService.newInstance())
                .addService(new SalaryAccountService()).build();
    }

    public void start() throws Exception {
        server.start();
        logger.info("Server started, listening on " + port);
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                // Use stderr here since the logger may have been reset by its JVM shutdown hook.
                System.err.println("*** shutting down gRPC server since JVM is shutting down");
                try {
                    SalaryAccountServer.this.stop();
                } catch (InterruptedException e) {
                    e.printStackTrace(System.err);
                }
                System.err.println("*** server shut down");
            }
        });
    }

    public void stop() throws InterruptedException {
        if (server != null) {
            server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
        }
    }

    /**
     * Await termination on the main thread since the grpc library uses daemon threads.
     */
    public void blockUntilShutdown() throws InterruptedException {
        if (server != null) {
            server.awaitTermination();
        }
    }

    public static void main(String[] args) throws Exception {
        SalaryAccountServer salaryServer = new SalaryAccountServer(8980);
        salaryServer.start();
        salaryServer.blockUntilShutdown();
    }

    private static class SalaryAccountService extends SalaryAccountServiceGrpc.SalaryAccountServiceImplBase {
        @Override
        public void getSalaryDetails(SalaryRequest request, StreamObserver<SalaryResponse> responseObserver) {
            Month month = Month.newBuilder().setMonthName("July").build();
            Salary salary = Salary.newBuilder().setEmployeeId(100)
                    .setBasicPay(20000)
                    .setAllowances(5000)
                    .setSalaryMonth(month)
                    .build();
            SalaryResponse salaryResponse = SalaryResponse.newBuilder().addSalary(salary).build();
            responseObserver.onNext(salaryResponse);
            responseObserver.onCompleted();
        }
    }
}



