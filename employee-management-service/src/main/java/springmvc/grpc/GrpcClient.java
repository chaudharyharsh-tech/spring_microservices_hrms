package springmvc.grpc;

import com.chaudharyharsh.salaryaccountservice.SalaryAccountServiceGrpc;
import com.chaudharyharsh.salaryaccountservice.SalaryRequest;
import com.chaudharyharsh.salaryaccountservice.SalaryResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GrpcClient {
    private static final Logger log = LoggerFactory.getLogger(
            GrpcClient.class);

    private final SalaryAccountServiceGrpc.SalaryAccountServiceBlockingStub blockingStub;

    public GrpcClient(@Value("${salary.service.host:localhost}") String host,
                      @Value("${salary.service.port:8980}") int port) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
        blockingStub = SalaryAccountServiceGrpc.newBlockingStub(channel);
    }

    public SalaryResponse getSalary(int employee_id) {
        SalaryRequest request = SalaryRequest.newBuilder().setEmployeeId(employee_id).build();
        SalaryResponse response = blockingStub.getSalaryDetails(request);
        log.info("Received response from salary service via GRPC :{}", response);
        return response;
    }
}
