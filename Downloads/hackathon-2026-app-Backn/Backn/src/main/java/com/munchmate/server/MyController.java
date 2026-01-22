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

    @GetMapping("/check-connection")
    public String check() {
        System.out.println("!!! קיבלתי בקשה מהלקוח עכשיו !!!");
        return "החיבור הצליח! השרת והלקוח מדברים.";
    }

    @GetMapping("/signUp")
    public String singUp(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String phoneNumber) {
        return dbUtils.signUp(username, password, phoneNumber);
    }
    @GetMapping("/signIn")
    public String singIn(
            @RequestParam String username,
            @RequestParam String password) {
        return dbUtils.signIn(username, password);
    }

    @GetMapping("/remove_user")
    public String removeUser(
            @RequestParam String username,
            @RequestParam String password) {
        return dbUtils.removeUser(username, password);
    }



}