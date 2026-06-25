package springmvc.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserNotDeletedException.class)
    public ResponseEntity<Map<String, String>> handleUserDeletionException(UserNotDeletedException ex){
        Map<String, String> errors = new HashMap<>();
        errors.put("errors", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    /**
     * Handles exceptions from Spring's data access layer.
     * Spring's JdbcTemplate and other data access tools translate checked SQLExceptions
     * into subclasses of the unchecked DataAccessException. This handler will catch them all.
     *
     * @param ex The DataAccessException that was thrown.
     * @return A response entity with a user-friendly error message.
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<String> handleDataAccessExceptions(DataAccessException ex) {
        // It's a good practice to log the full exception for debugging.
        logger.error("A data access exception occurred: {}", ex.getMessage(), ex);

        // You can return a generic error message to the user.
        return new ResponseEntity<>("A database error occurred. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}