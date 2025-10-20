package com.codequest.backend.controller;

import com.codequest.backend.entity.Problem;
import com.codequest.backend.repository.ProblemRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

//import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
//@CrossOrigin(origins = "*") // Enable CORS for all origins (change this in production)
public class ProblemController {

    private final ProblemRepository problemRepository;

    public ProblemController(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }


    // Get all problems with pagination and sorting
    @GetMapping
    public List<Problem> getAllProblems(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "title") String sortBy) {
        // You can implement pagination and sorting here
        return problemRepository.findAll(PageRequest.of(page, size, Sort.by(sortBy))).getContent();
    }

    // Create a new problem
    @PostMapping
    public Problem createProblem(@Valid @RequestBody Problem problem) {

        return problemRepository.save(problem);
    }

    // Update an existing problem
    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable String id, @Valid @RequestBody Problem updatedProblem) {
        // Check if the problem exists before updating
        Problem existingProblem = problemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        // Update fields
        existingProblem.setTitle(updatedProblem.getTitle());
        existingProblem.setDescription(updatedProblem.getDescription());
        existingProblem.setDifficulty(updatedProblem.getDifficulty());

        return problemRepository.save(existingProblem);
    }

    // Delete a problem
    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable String id) {
        // Check if the problem exists before deleting
        Problem existingProblem = problemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        problemRepository.delete(existingProblem);
    }

    // Get a specific problem by its ID
    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable String id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
    }

    // Handle exceptions globally for better error handling
    @ExceptionHandler(ResponseStatusException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleResponseStatusException(ResponseStatusException ex) {
        return ex.getReason();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleException(Exception ex) {
        return "An unexpected error occurred: " + ex.getMessage();
    }
}
