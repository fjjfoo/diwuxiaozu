package com.crypto.controller;

import com.crypto.entity.CryptoCurrency;
import com.crypto.service.CryptoCurrencyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/crypto")
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class CryptoCurrencyController {

    private final CryptoCurrencyService cryptoService;

    @Autowired
    public CryptoCurrencyController(CryptoCurrencyService cryptoService) {
        this.cryptoService = cryptoService;
    }

    /**
     * 批量保存/更新数据（添加参数校验）
     */
    @PostMapping("/batch-save")
    public ResponseEntity<Object> batchSaveOrUpdate(@Valid @RequestBody List<CryptoCurrency> cryptoList) {
        try {
            cryptoService.batchSaveOrUpdate(cryptoList);
            return ResponseEntity.ok(Map.of("code", 200, "message", "数据保存/更新成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("code", 400, "message", "操作失败：" + e.getMessage()));
        }
    }

    /**
     * 查询所有数据
     */
    @GetMapping("/list")
    public ResponseEntity<List<CryptoCurrency>> findAll() {
        return ResponseEntity.ok(cryptoService.findAll());
    }

    /**
     * 处理参数校验失败的异常，返回详细错误信息
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
}