package springmvc.exceptions;

public class SalaryNotCreatedException extends RuntimeException {
    public SalaryNotCreatedException(String message) {
        super(message);
    }
}
