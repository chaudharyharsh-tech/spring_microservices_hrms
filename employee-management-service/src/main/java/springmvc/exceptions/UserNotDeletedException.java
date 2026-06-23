package springmvc.exceptions;

public class UserNotDeletedException extends RuntimeException {
    public UserNotDeletedException(String message) {
        super(message);
    }
}
