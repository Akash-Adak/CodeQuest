package com.codequest.backend.util;

public class LanguageCommandUtil {
    public static String getRunCommand(String language, String filename) {
        return switch (language.toLowerCase()) {
            case "java" -> "javac " + filename + ".java && java " + filename;
            case "python" -> "python3 " + filename + ".py";
            case "cpp" -> "g++ " + filename + ".cpp -o " + filename + " && ./" + filename;
            default -> throw new RuntimeException("Unsupported language: " + language);
        };
    }

    public static String getFileExtension(String language) {
        return switch (language.toLowerCase()) {
            case "java" -> ".java";
            case "python" -> ".py";
            case "cpp" -> ".cpp";
            default -> ".txt";
        };
    }
}
