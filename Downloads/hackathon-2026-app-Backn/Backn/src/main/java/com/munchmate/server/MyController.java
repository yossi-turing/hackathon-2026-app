package com.munchmate.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class MyController {

    @Autowired
    private DbUtils dbUtils;

    @GetMapping("/data")
    public String getData() {
        System.out.println("נקראה הפונקציה getData!");
        return "hello from /data";
    }

    @GetMapping("/add_user")
    public String addUser(
            @RequestParam String username,
            @RequestParam String password) {
        return dbUtils.addUser(username, password);
    }
    @GetMapping("/check_user")
    public String checkUser(
            @RequestParam String username,
            @RequestParam String password) {
        return dbUtils.checkUser(username, password);
    }

}