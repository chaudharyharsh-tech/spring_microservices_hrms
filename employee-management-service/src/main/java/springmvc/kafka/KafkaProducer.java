package springmvc.kafka;

import com.chaudharyharsh.salaryaccountservice.Salary;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import salary.events.Date;
import salary.events.Month;
import salary.events.SalaryEvent;

@Slf4j
@Service
public class KafkaProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, byte[]> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEvent(Salary salary) {
        Date date = Date.newBuilder()
                .setDay(salary.getCreatedDate().getDay())
                .setMonth(salary.getCreatedDate().getMonth())
                .setYear(salary.getCreatedDate().getYear())
                .build();

        Month month = Month.newBuilder().setMonthName(salary.getSalaryMonth().getMonthName()).build();

        SalaryEvent event = SalaryEvent.newBuilder()
                .setEmployeeId(String.valueOf(salary.getEmployeeId()))
                .setSalary(salary.getSalary())
                .setCreatedDate(date)
                .setSalaryMonth(month)
                .build();

        try{
            kafkaTemplate.send("my-events", event.toByteArray());
        } catch(Exception e) {
            log.error("Error sending Salary event:{}", event);
        }


    }
}
