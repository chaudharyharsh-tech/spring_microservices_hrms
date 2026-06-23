package springmvc.validators;

import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import springmvc.model.Employee;
import springmvc.model.Position;

@Component
public class EmployeeValidator implements Validator {
    @Override
    public boolean supports(@NonNull Class clazz){
        return Employee.class.equals(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        ValidationUtils.rejectIfEmpty(errors, "id", "empty.id");
        ValidationUtils.rejectIfEmpty(errors, "name", "empty.name");
        ValidationUtils.rejectIfEmpty(errors, "position", "empty.position");

        Employee employee = (Employee) target;

        if(employee.getId() < 0) {
            errors.rejectValue("id", "negative.value");
        }

        if(employee.getName().length() > 30) {
            errors.rejectValue("name", "name.too.long");
        }

        if(employee.getPosition() != null && !employee.getPosition().isBlank()) {
            try{
                Position.valueOf(employee.getPosition().trim().toLowerCase());
            } catch (IllegalArgumentException e) {
                errors.rejectValue("position", "invalid.position");
            }
        }
    }
}
