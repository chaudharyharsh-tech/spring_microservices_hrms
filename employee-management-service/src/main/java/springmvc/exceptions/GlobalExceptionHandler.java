package springmvc.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotDeletedException.class)
    public ResponseEntity<Map<String, String>> handleUserDeletionException(UserNotDeletedException ex){
        Map<String, String> errors = new HashMap<>();
        errors.put("errors", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }
}
